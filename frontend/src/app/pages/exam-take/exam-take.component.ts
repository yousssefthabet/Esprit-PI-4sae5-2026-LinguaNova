import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ExamService } from '../../services/exam.service';
import { QuestionService } from '../../services/question.service';
import { ReponseService } from '../../services/reponse.service';
import { StudentExamService } from '../../services/student-exam.service';
import { StudentProfileService } from '../../services/student-profile.service';
import { VoiceService } from '../../services/voice.service';
import type { Exam, Question, Reponse, StudentExam, StudentAnswer, StudentProfile } from '../../models';

@Component({
  selector: 'app-exam-take',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './exam-take.component.html',
  styleUrl: './exam-take.component.scss',
})
export class ExamTakeComponent implements OnInit, OnDestroy {
  exam = signal<Exam | null>(null);
  questions = signal<Question[]>([]);
  profiles = signal<StudentProfile[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  selectedProfileId = signal<number | null>(null);
  textAnswers = signal<Record<number, string>>({});
  selectedReponseIds = signal<Record<number, number>>({});

  submitting = signal(false);
  submitError = signal<string | null>(null);

  currentQuestionIndex = signal(0);
  currentQuestion = computed(() => {
    const qs = this.questions();
    const idx = this.currentQuestionIndex();
    return qs[idx] ?? null;
  });
  totalQuestions = computed(() => this.questions().length);

  // ── Voice mode ─────────────────────────────────────────────────────────────
  voiceMode = signal(false);
  listening = signal(false);
  voiceStatus = signal('');
  /** When true, the next speech input is treated as a profile name, not a command. */
  private awaitingProfile = false;
  get sttSupported(): boolean { return this.voice.isSTTSupported; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private questionService: QuestionService,
    private reponseService: ReponseService,
    private studentExamService: StudentExamService,
    private studentProfileService: StudentProfileService,
    public voice: VoiceService,
  ) { }

  ngOnInit(): void {
    this.studentProfileService.getAll().subscribe({
      next: (list) => this.profiles.set(list),
      error: () => { },
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/examens']); return; }
    const examId = Number(id);

    this.examService.getById(examId).subscribe({
      next: (e) => {
        this.exam.set(e);
        // With our backend N+1 fix (@EntityGraph), the exam object already contains
        // the full tree of questions and their nested responses.
        if (e.questions && e.questions.length > 0) {
          this.questions.set(e.questions);
          this.loading.set(false);
          // Initial reading if needed (will happen via readCurrentQuestion if voiceMode toggled)
        } else {
          // Fallback if questions are missing for some reason
          this.error.set('This exam has no questions.');
          this.loading.set(false);
        }
      },
      error: () => {
        this.error.set('Examen non trouvé ou erreur serveur.');
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.voice.stopSpeaking();
    this.voice.stopListening();
  }

  // ── Existing helpers ────────────────────────────────────────────────────────
  getReponses(question: Question): Reponse[] { return question.reponses ?? []; }

  selectReponse(questionId: number, reponseId: number): void {
    this.selectedReponseIds.update((m) => ({ ...m, [questionId]: reponseId }));
  }

  setTextAnswer(questionId: number, value: string): void {
    this.textAnswers.update((m) => ({ ...m, [questionId]: value }));
  }

  goNext(): void {
    const total = this.totalQuestions();
    const idx = this.currentQuestionIndex();
    if (idx < total - 1) this.currentQuestionIndex.set(idx + 1);
  }

  goPrev(): void {
    const idx = this.currentQuestionIndex();
    if (idx > 0) this.currentQuestionIndex.set(idx - 1);
  }

  onProfileSelect(event: Event): void {
    const el = event.target as HTMLSelectElement;
    const val = el?.value;
    this.selectedProfileId.set(val ? Number(val) : null);
  }

  submitExam(): void {
    const profileId = this.selectedProfileId();
    if (!profileId || !this.exam()?.id) {
      this.submitError.set('Please select your student profile.');
      return;
    }
    this.submitting.set(true);
    this.submitError.set(null);

    const exam = this.exam()!;
    const answers = this.questions().map((q) => {
      const answer: any = { question: { id: q.id } };
      if (q.type === 'TEXT') {
        answer.textAnswer = this.textAnswers()[q.id!] ?? '';
      } else {
        const repId = this.selectedReponseIds()[q.id!];
        if (repId) answer.selectedReponse = { id: repId };
      }
      return answer;
    });

    const studentExam = {
      studentProfile: { id: profileId },
      exam: { id: exam.id },
      answers,
    };

    this.studentExamService.submit(studentExam as StudentExam).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.router.navigate(['/mes-resultats'], { queryParams: { highlight: result.id } });
      },
      error: (err) => {
        this.submitting.set(false);
        let errorMessage = 'Submission error. Please check your profile and retry.';
        if (err.error?.message) errorMessage = err.error.message;
        else if (err.error?.errors) {
          const v = err.error.errors;
          errorMessage = Object.keys(v).map((k) => `${k}: ${v[k]}`).join(', ');
        } else if (err.message) errorMessage = err.message;
        this.submitError.set(errorMessage);
      },
    });
  }

  // ── Voice mode ──────────────────────────────────────────────────────────────

  /** Toggle voice mode on/off and announce the current question when activated. */
  async toggleVoiceMode(): Promise<void> {
    const next = !this.voiceMode();
    this.voiceMode.set(next);
    if (next) {
      await this.readCurrentQuestion();
    } else {
      this.voice.stopSpeaking();
      this.voice.stopListening();
      this.listening.set(false);
      this.voiceStatus.set('');
    }
  }

  /** Build a full TTS string for the current question. */
  private buildQuestionSpeech(): string {
    const q = this.currentQuestion();
    const idx = this.currentQuestionIndex();
    const total = this.totalQuestions();
    if (!q) return '';

    let text = `Question ${idx + 1} of ${total}. ${q.content}`;

    if (q.type === 'QCM' || q.type === 'TRUE_FALSE') {
      const reps = this.getReponses(q);
      reps.forEach((r, i) => {
        text += `. Option ${i + 1}: ${r.content}`;
      });
      text += '. Say the option number, or say "next", "previous", or "submit".';
    } else {
      text += '. This is an open text question. Dictate your answer, then say "next" or "submit".';
    }
    return text;
  }

  /** Read the current question aloud, then start listening. */
  async readCurrentQuestion(): Promise<void> {
    if (!this.voiceMode()) return;
    this.voiceStatus.set('Reading question…');
    await this.voice.speak(this.buildQuestionSpeech());
    if (this.voiceMode()) this.startListening();
  }

  /** Start STT and process the result. */
  startListening(): void {
    if (!this.voice.isSTTSupported || this.listening()) return;
    this.listening.set(true);
    this.voiceStatus.set('Listening…');

    this.voice.listen().subscribe({
      next: (transcript) => {
        this.listening.set(false);
        this.voiceStatus.set(`Heard: "${transcript}"`);
        this.processCommand(transcript);
      },
      error: () => {
        this.listening.set(false);
        this.voiceStatus.set('Could not understand. Tap the mic to try again.');
      },
      complete: () => {
        this.listening.set(false);
        if (this.voiceStatus() === 'Listening…') {
          this.voiceStatus.set('No speech detected. Tap the mic to try again.');
        }
      },
    });
  }

  /** Map a transcript to an action. */
  private async processCommand(transcript: string): Promise<void> {

    // ── Profile-selection mode (triggered after "submit" with no profile) ────
    if (this.awaitingProfile) {
      this.awaitingProfile = false;
      await this.matchProfileFromTranscript(transcript);
      return;
    }

    const q = this.currentQuestion();
    if (!q) return;

    // ── Navigation commands ─────────────────────────────────────────
    if (/\b(next|forward|continue)\b/.test(transcript)) {
      if (this.currentQuestionIndex() < this.totalQuestions() - 1) {
        this.goNext();
        await this.readCurrentQuestion();
      } else {
        await this.voice.speak('You are on the last question. Say "submit" to finish the exam.');
        this.startListening();
      }
      return;
    }

    if (/\b(previous|back|go back)\b/.test(transcript)) {
      if (this.currentQuestionIndex() > 0) {
        this.goPrev();
        await this.readCurrentQuestion();
      } else {
        await this.voice.speak('You are already on the first question.');
        this.startListening();
      }
      return;
    }

    if (/\b(repeat|again|re-?read)\b/.test(transcript)) {
      await this.readCurrentQuestion();
      return;
    }

    if (/\b(submit|finish|done|end)\b/.test(transcript)) {
      if (!this.selectedProfileId()) {
        await this.askForProfile();
      } else {
        await this.voice.speak('Submitting your exam now.');
        this.submitExam();
      }
      return;
    }

    // ── Answer commands (QCM / TRUE_FALSE) ─────────────────────────
    if (q.type === 'QCM' || q.type === 'TRUE_FALSE') {
      const reps = this.getReponses(q);

      // Match "one"/"first"/"1" → index 0, "two"/"second"/"2" → index 1, etc.
      const numberWords: string[][] = [
        ['one', 'first', '1', 'a'],
        ['two', 'second', '2', 'b'],
        ['three', 'third', '3', 'c'],
        ['four', 'fourth', '4', 'd'],
      ];

      // TRUE_FALSE shortcuts
      if (q.type === 'TRUE_FALSE') {
        if (/\b(true|yes|correct)\b/.test(transcript)) {
          const trueRep = reps.find((r) => /true/i.test(r.content ?? ''));
          if (trueRep?.id) {
            this.selectReponse(q.id!, trueRep.id);
            await this.voice.speak('Selected: True. Say "next", "previous", or "submit".');
            this.startListening();
            return;
          }
        }
        if (/\b(false|no|wrong|incorrect)\b/.test(transcript)) {
          const falseRep = reps.find((r) => /false/i.test(r.content ?? ''));
          if (falseRep?.id) {
            this.selectReponse(q.id!, falseRep.id);
            await this.voice.speak('Selected: False. Say "next", "previous", or "submit".');
            this.startListening();
            return;
          }
        }
      }

      // Numeric / letter matching
      for (let i = 0; i < numberWords.length; i++) {
        const pattern = new RegExp(`\\b(${numberWords[i].join('|')})\\b`);
        if (pattern.test(transcript) && reps[i]?.id) {
          this.selectReponse(q.id!, reps[i].id!);
          await this.voice.speak(
            `Selected option ${i + 1}: ${reps[i].content}. Say "next", "previous", or "submit".`,
          );
          this.startListening();
          return;
        }
      }
    }

    // ── Text answer (free dictation) ────────────────────────────────
    if (q.type === 'TEXT') {
      this.setTextAnswer(q.id!, transcript);
      await this.voice.speak(
        `Answer recorded: "${transcript}". Say "next", "previous", or "submit".`,
      );
      this.startListening();
      return;
    }

    // ── Unknown command ─────────────────────────────────────────────
    await this.voice.speak(
      'I did not understand. Say a number to choose an option, or say "repeat", "next", "previous", or "submit".',
    );
    this.startListening();
  }

  /**
   * Voice-driven profile selection.
   * Sets awaitingProfile = true, speaks the profile list, then lets
   * the existing startListening() → processCommand() pipeline handle
   * the student's spoken name via matchProfileFromTranscript().
   */
  private async askForProfile(): Promise<void> {
    const profiles = this.profiles();
    if (profiles.length === 0) {
      await this.voice.speak('No student profiles are available. Please ask your teacher.');
      this.startListening();
      return;
    }

    let listText = 'Please say your name to identify yourself. Available profiles: ';
    listText += profiles
      .map((p, i) => `Profile ${i + 1}: ${p.firstName} ${p.lastName}`)
      .join('. ');
    listText += '. Say your first or last name.';

    await this.voice.speak(listText);

    // Flag the pipeline so the next transcript goes to name matching, not commands.
    this.awaitingProfile = true;
    this.voiceStatus.set('Listening for your name…');
    this.startListening();
  }

  /** Strip diacritics for accent-tolerant matching (e.g. "eric" matches "Éric"). */
  private normalize(s: string): string {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  }

  /** Match a transcript against loaded profiles and proceed to submit. */
  private async matchProfileFromTranscript(transcript: string): Promise<void> {
    const profiles = this.profiles();
    const words = this.normalize(transcript).split(/\s+/).filter(w => w.length > 1);

    const matched = profiles.find((p) =>
      words.some(
        (w) =>
          this.normalize(p.firstName).includes(w) ||
          this.normalize(p.lastName).includes(w),
      ),
    );

    if (matched?.id) {
      this.selectedProfileId.set(matched.id);
      await this.voice.speak(
        `Profile selected: ${matched.firstName} ${matched.lastName}. Submitting your exam now.`,
      );
      this.submitExam();
    } else {
      await this.voice.speak(
        'I could not match that name. Please say your first or last name again.',
      );
      // Give another chance — set the flag again
      this.awaitingProfile = true;
      this.voiceStatus.set('Listening for your name…');
      this.startListening();
    }
  }
}
