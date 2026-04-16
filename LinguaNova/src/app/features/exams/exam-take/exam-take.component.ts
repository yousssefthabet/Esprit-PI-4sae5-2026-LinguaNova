import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamService } from '../../../core/services/exam.service';
import { StudentExamService } from '../../../core/services/student-exam.service';
import { CertificateService } from '../../../core/services/certificate.service';
import { VoiceService } from '../../../core/services/voice.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { Exam } from '../../../core/models/exam.model';
import { Question } from '../../../core/models/exam-question.model';

@Component({
  selector: 'app-exam-take',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exam-take.component.html',
  styleUrls: ['./exam-take.component.scss'],
})
export class ExamTakeComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);
  private studentExamService = inject(StudentExamService);
  private certificateService = inject(CertificateService);
  private voiceService = inject(VoiceService);
  private authService = inject(AuthService);

  exam = signal<Exam | null>(null);
  selectedUserId = signal<number | null>(null);
  loadedStudentLabel = signal('');
  currentIndex = signal(0);
  answers = signal<{ [questionId: number]: { textAnswer?: string; selectedReponseId?: number } }>({});
  loading = signal(true);
  submitting = signal(false);
  error = signal('');
  voiceMode = signal(false);
  voiceActive = signal(false);
  recognizedText = signal('');

  currentQuestion = computed<Question | null>(() => {
    const q = this.exam()?.questions;
    return q && q.length > this.currentIndex() ? q[this.currentIndex()] : null;
  });

  totalQuestions = computed(() => this.exam()?.questions?.length ?? 0);
  progress = computed(() => this.totalQuestions() === 0 ? 0 : Math.round(((this.currentIndex() + 1) / this.totalQuestions()) * 100));

  private examId!: number;
  private listenSub?: Subscription;

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  ngOnDestroy(): void {
    this.listenSub?.unsubscribe();
    this.voiceService.stopListening();
    this.voiceService.stopSpeaking();
  }

  private loadData(): void {
    this.loading.set(true);
    this.examService.getById(this.examId).subscribe({
      next: (exam) => {
        this.exam.set(exam);
        const currentUser = this.authService.currentUserValue;
        const currentUserId = currentUser && currentUser.id ? Number(currentUser.id) : NaN;

        if (!currentUser || currentUser.role !== UserRole.STUDENT) {
          this.error.set('Seul un compte etudiant peut passer cet examen.');
          this.loading.set(false);
          return;
        }

        if (Number.isNaN(currentUserId)) {
          this.error.set('Impossible d\'identifier votre compte utilisateur.');
          this.loading.set(false);
          return;
        }

        this.selectedUserId.set(currentUserId);
        const firstName = currentUser.firstName ? currentUser.firstName.trim() : '';
        const lastName = currentUser.lastName ? currentUser.lastName.trim() : '';
        const fullName = (firstName + ' ' + lastName).trim();
        this.loadedStudentLabel.set(fullName || currentUser.email || 'Etudiant');
        this.loading.set(false);
      },
      error: () => { this.error.set('Erreur lors du chargement de l\'examen.'); this.loading.set(false); }
    });
  }

  selectReponse(questionId: number, reponseId: number): void {
    this.answers.update(a => ({ ...a, [questionId]: { selectedReponseId: reponseId } }));
  }

  setTextAnswer(questionId: number, text: string): void {
    this.answers.update(a => ({ ...a, [questionId]: { textAnswer: text } }));
  }

  isSelected(questionId: number, reponseId: number): boolean {
    return this.answers()[questionId]?.selectedReponseId === reponseId;
  }

  getTextAnswer(questionId: number): string {
    return this.answers()[questionId]?.textAnswer ?? '';
  }

  prev(): void {
    if (this.currentIndex() > 0) this.currentIndex.update(i => i - 1);
  }

  next(): void {
    if (this.currentIndex() < this.totalQuestions() - 1) this.currentIndex.update(i => i + 1);
  }

  goTo(idx: number): void { this.currentIndex.set(idx); }

  toggleVoiceMode(): void {
    this.voiceMode.update(v => !v);
    if (!this.voiceMode()) {
      this.stopVoiceLoop();
      this.voiceService.stopSpeaking();
    } else {
      // Auto-start reading immediately when turned on
      setTimeout(() => this.readQuestionAndListen(), 500);
    }
  }

  toggleListening(): void {
    if (this.voiceActive()) {
      this.stopVoiceLoop();
    } else {
      this.startVoiceLoop();
    }
  }

  private stopVoiceLoop(): void {
    this.voiceService.stopListening();
    this.listenSub?.unsubscribe();
    this.voiceActive.set(false);
  }

  private startVoiceLoop(): void {
    this.stopVoiceLoop();
    this.voiceActive.set(true);
    this.listenSub = this.voiceService.listen().subscribe({
      next: (text: string) => {
        this.recognizedText.set(text);
        this.handleVoiceCommand(text);
      },
      error: () => { 
        this.voiceActive.set(false); 
      }
    });
  }

  private handleVoiceCommand(text: string): void {
    this.voiceActive.set(false);
    const cmd = text.toLowerCase();
    
    if (cmd.includes('repeat') || cmd.includes('read question')) {
      this.readQuestionAndListen();
    } else if (cmd.includes('read option') || cmd.includes('options')) {
      this.readOptionsAndListen();
    } else if (cmd.includes('next')) {
      if (this.currentIndex() < this.totalQuestions() - 1) {
        this.next();
        this.readQuestionAndListen();
      } else {
        this.voiceService.speak("This is the last question. Say submit to finish.").then(() => this.startVoiceLoop());
      }
    } else if (cmd.includes('previous') || cmd.includes('back')) {
      if (this.currentIndex() > 0) {
        this.prev();
        this.readQuestionAndListen();
      } else {
        this.voiceService.speak("This is the first question.").then(() => this.startVoiceLoop());
      }
    } else if (cmd.includes('submit')) {
      this.voiceService.speak("Submitting your exam now.").then(() => {
        if (!this.submitting() && this.selectedUserId() != null) {
          this.submit();
        }
      });
    } else {
      // Check if it matches an option selection
      const q = this.currentQuestion();
      if (q && (q.type === 'QCM' || q.type === 'TRUE_FALSE')) {
        const optionWords = ['one', 'two', 'three', 'four'];
        let matched = false;
        
        for (let i = 0; i < (q.reponses?.length || 0); i++) {
          const numStr = (i + 1).toString();
          const wordStr = optionWords[i];
          if (cmd.includes('option ' + numStr) || cmd.includes('option ' + wordStr) || cmd.match(new RegExp(`^${numStr}$`)) || cmd.match(new RegExp(`^${wordStr}$`))) {
            const repId = q.reponses![i].id!;
            this.selectReponse(q.id!, repId);
            this.voiceService.speak(`Selected option ${i + 1}`).then(() => this.startVoiceLoop());
            matched = true;
            break;
          }
        }
        
        // If not matched, maybe read error
        if (!matched) {
          this.voiceService.speak("Command not recognized. Say repeat, next, or choose an option.").then(() => this.startVoiceLoop());
        }
      } else if (q && q.type === 'TEXT') {
        // Treat as dictated answer
        this.setTextAnswer(q.id!, text);
        this.voiceService.speak("Answer recorded. Say next to continue, or repeat to dictate again.").then(() => this.startVoiceLoop());
      }
    }
  }

  readQuestionAndListen(): void {
    const q = this.currentQuestion();
    if (q) {
      let prompt = `Question ${this.currentIndex() + 1}. ${q.content}. `;
      
      if ((q.type === 'QCM' || q.type === 'TRUE_FALSE') && q.reponses && q.reponses.length > 0) {
        prompt += 'The options are: ';
        q.reponses.forEach((r, idx) => {
          prompt += `Option ${idx + 1}: ${r.content}. `;
        });
        prompt += 'You can speak your option like option one, or say next or previous.';
      } else if (q.type === 'TEXT') {
        prompt += 'This is an open ended question. Please dictate your answer after the beep, or say next or previous.';
      } else {
        prompt += 'Say next or previous.';
      }

      this.voiceService.speak(prompt).then(() => {
        this.startVoiceLoop();
      });
    }
  }
  
  readOptionsAndListen(): void {
    const q = this.currentQuestion();
    if (q && (q.type === 'QCM' || q.type === 'TRUE_FALSE') && q.reponses) {
      let text = "Options are: ";
      q.reponses.forEach((r, idx) => {
        text += `Option ${idx + 1}: ${r.content}. `;
      });
      this.voiceService.speak(text).then(() => {
        this.startVoiceLoop();
      });
    } else {
      this.voiceService.speak("This question has no specific options.").then(() => this.startVoiceLoop());
    }
  }

  readQuestion(): void {
    const q = this.currentQuestion();
    if (q) this.voiceService.speak(q.content);
  }

  submit(): void {
    if (this.selectedUserId() == null) {
      this.error.set('Utilisateur etudiant non charge.');
      return;
    }
    this.submitting.set(true);
    const payload: any = {
      userId: this.selectedUserId(),
      exam: { id: this.examId },
      answers: Object.entries(this.answers()).map(([qId, ans]) => ({
        question: { id: Number(qId) },
        textAnswer: ans.textAnswer ?? null,
        selectedReponse: ans.selectedReponseId ? { id: ans.selectedReponseId } : null,
      })),
    };
    this.studentExamService.submit(payload).subscribe({
      next: (submittedExam) => {
        const submittedId = submittedExam.id;
        if (!submittedId) {
          this.submitting.set(false);
          this.router.navigate(['/mes-resultats']);
          return;
        }

        this.certificateService.generate(submittedId).subscribe({
          next: () => {
            this.submitting.set(false);
            this.router.navigate(['/mes-resultats']);
          },
          error: () => {
            // L'endpoint est idempotent et peut retourner une erreur si non éligible.
            this.submitting.set(false);
            this.router.navigate(['/mes-resultats']);
          }
        });
      },
      error: () => {
        this.error.set('Erreur lors de la soumission de l\'examen.');
        this.submitting.set(false);
      }
    });
  }
}

