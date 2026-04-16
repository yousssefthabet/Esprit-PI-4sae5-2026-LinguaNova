import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../../core/services/exam.service';
import { ExamQuizService } from '../../../core/services/exam-quiz.service';
import type { Exam } from '../../../core/models/exam.model';
import type { Question } from '../../../core/models/exam-question.model';
import type { ExamReponse } from '../../../core/models/exam-reponse.model';
import type { QuestionType } from '../../../core/models/question-type';
import type { ExamStatus } from '../../../core/models/exam-status';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './exam-form.component.html',
  styleUrl: './exam-form.component.scss',
})
export class ExamFormComponent implements OnInit {
  isEdit = signal(false);
  examId = signal<number | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  title = signal('');
  description = signal('');
  courseName = signal('');
  maxScore = signal(20);
  examStatus = signal<ExamStatus>('DRAFT');
  questions = signal<Question[]>([]);

  aiNumQuestions = 5;
  aiDifficulty = 'medium';
  generatingAi = signal(false);
  aiError = signal<string | null>(null);

  readonly difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  statusOptions: { value: ExamStatus; label: string }[] = [
    { value: 'DRAFT', label: 'Brouillon' },
    { value: 'PUBLISHED', label: 'Publié' },
    { value: 'CLOSED', label: 'Clôturé' },
  ];

  questionTypeOptions: { value: QuestionType; label: string }[] = [
    { value: 'QCM', label: 'Choix multiple (QCM)' },
    { value: 'TRUE_FALSE', label: 'Vrai/Faux' },
    { value: 'TEXT', label: 'Réponse texte' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private quizService: ExamQuizService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nouveau') {
      this.isEdit.set(true);
      this.examId.set(Number(id));
      this.examService.getById(Number(id)).subscribe({
        next: (e) => {
          this.title.set(e.title);
          this.description.set(e.description);
          this.courseName.set(e.courseName);
          this.maxScore.set(e.maxScore);
          this.examStatus.set(e.examStatus);
          if (e.questions) this.questions.set(e.questions as Question[]);
          this.loading.set(false);
        },
        error: () => { this.error.set('Examen introuvable.'); this.loading.set(false); },
      });
    } else {
      this.loading.set(false);
    }
  }

  setField(field: 'title' | 'description' | 'courseName' | 'maxScore' | 'examStatus', value: string | number): void {
    if (field === 'maxScore') this.maxScore.set(Number(value));
    else if (field === 'examStatus') this.examStatus.set(value as ExamStatus);
    else if (field === 'title') this.title.set(String(value));
    else if (field === 'description') this.description.set(String(value));
    else if (field === 'courseName') this.courseName.set(String(value));
  }

  generateQuestionsWithAi(): void {
    const t = this.title().trim(), d = this.description().trim(), c = this.courseName().trim();
    if (!t || !d || !c) { this.aiError.set('Remplissez Titre, Description et Cours avant de générer.'); return; }
    this.aiError.set(null);
    this.generatingAi.set(true);
    this.quizService.generateExamQuestions({ title: t, description: d, courseName: c, difficulty: this.aiDifficulty, numQuestions: this.aiNumQuestions }).subscribe({
      next: (result) => {
        this.generatingAi.set(false);
        const mapped: Question[] = result.questions.map(q => ({
          content: q.content, score: 1, type: q.type as QuestionType,
          reponses: q.options.map((opt, idx) => ({ content: opt, correct: idx === q.correctIndex })),
        }));
        this.questions.update(existing => [...existing, ...mapped]);
      },
      error: (err) => { this.generatingAi.set(false); this.aiError.set(err?.error?.message || err?.message || 'Génération IA échouée.'); },
    });
  }

  save(): void {
    const t = this.title().trim(), d = this.description().trim(), c = this.courseName().trim(), m = this.maxScore();
    if (!t || !d || !c || m <= 0) { this.error.set('Remplissez tous les champs obligatoires.'); return; }
    if (t.length < 3 || t.length > 255) { this.error.set('Le titre doit contenir entre 3 et 255 caractères.'); return; }
    if (d.length < 10 || d.length > 1000) { this.error.set('La description doit contenir entre 10 et 1000 caractères.'); return; }
    if (c.length < 2 || c.length > 100) { this.error.set('Le nom du cours doit contenir entre 2 et 100 caractères.'); return; }
    const qs = this.questions();
    if (qs.length === 0) { this.error.set('Ajoutez au moins une question à l\'examen.'); return; }
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      if (!q.content || q.content.trim().length < 5) { this.error.set(`Question ${i + 1}: contenu trop court (min 5 car.).`); return; }
      if (q.score <= 0) { this.error.set(`Question ${i + 1}: le score doit être positif.`); return; }
      if (q.type === 'QCM' || q.type === 'TRUE_FALSE') {
        if (!q.reponses?.length) { this.error.set(`Question ${i + 1}: ajoutez au moins une réponse.`); return; }
        if (!q.reponses.some(r => r.correct)) { this.error.set(`Question ${i + 1}: au moins une réponse doit être correcte.`); return; }
      }
    }
    this.saving.set(true);
    this.error.set(null);
    const exam: Exam = {
      title: t, description: d, courseName: c, maxScore: m, examStatus: this.examStatus(),
      questions: qs.map(q => ({
        content: q.content.trim(), score: q.score, type: q.type,
        reponses: q.reponses?.map(r => ({ content: r.content.trim(), correct: r.correct }))
      })) as any,
    };
    const id = this.examId();
    const req = id ? this.examService.update(id, exam) : this.examService.create(exam);
    req.subscribe({
      next: () => { this.saving.set(false); this.router.navigate(['/examens'], { queryParams: { gestion: '1' } }); },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || err?.message || 'Erreur lors de l\'enregistrement.');
      },
    });
  }

  addQuestion(): void {
    this.questions.update(qs => [...qs, { content: '', score: 1, type: 'QCM', reponses: [] }]);
  }

  removeQuestion(index: number): void {
    this.questions.update(qs => qs.filter((_, i) => i !== index));
  }

  updateQuestionField(index: number, field: keyof Question, value: any): void {
    this.questions.update(qs => {
      const updated = [...qs];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'type' && value === 'TEXT') updated[index].reponses = [];
      else if (field === 'type' && value === 'TRUE_FALSE' && !updated[index].reponses?.length)
        updated[index].reponses = [{ content: 'Vrai', correct: false }, { content: 'Faux', correct: false }];
      else if (field === 'type' && value === 'QCM' && !updated[index].reponses?.length)
        updated[index].reponses = [{ content: '', correct: false }];
      return updated;
    });
  }

  addReponse(questionIndex: number): void {
    this.questions.update(qs => {
      const updated = [...qs];
      updated[questionIndex] = { ...updated[questionIndex], reponses: [...(updated[questionIndex].reponses || []), { content: '', correct: false }] };
      return updated;
    });
  }

  removeReponse(questionIndex: number, reponseIndex: number): void {
    this.questions.update(qs => {
      const updated = [...qs];
      updated[questionIndex] = { ...updated[questionIndex], reponses: updated[questionIndex].reponses!.filter((_, i) => i !== reponseIndex) };
      return updated;
    });
  }

  updateReponseField(questionIndex: number, reponseIndex: number, field: keyof ExamReponse, value: any): void {
    this.questions.update(qs => {
      const updated = [...qs];
      const reponses = [...updated[questionIndex].reponses!];
      reponses[reponseIndex] = { ...reponses[reponseIndex], [field]: value };
      updated[questionIndex] = { ...updated[questionIndex], reponses };
      return updated;
    });
  }
}
