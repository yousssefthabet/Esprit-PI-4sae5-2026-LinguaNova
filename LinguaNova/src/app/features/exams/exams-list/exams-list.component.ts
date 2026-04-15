import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../../core/services/exam.service';
import { ExamQuizService } from '../../../core/services/exam-quiz.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import type { Exam } from '../../../core/models/exam.model';
import type { GeneratedQuizResponse } from '../../../core/models/generated-quiz.model';

@Component({
  selector: 'app-exams-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './exams-list.component.html',
  styleUrl: './exams-list.component.scss',
})
export class ExamsListComponent implements OnInit {
  private examService = inject(ExamService);
  private quizService = inject(ExamQuizService);
  private authService = inject(AuthService);

  exams = signal<Exam[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  isTeacher = signal(false);

  quizTopic = '';
  quizDifficulty = 'medium';
  quizNumQuestions = 5;
  generatingQuiz = signal(false);
  quizError = signal<string | null>(null);
  generatedQuiz = signal<GeneratedQuizResponse | null>(null);
  quizAnswers = signal<Record<number, number>>({});
  quizSubmitted = signal<{ correct: number; total: number } | null>(null);

  readonly difficultyOptions = [
    { value: 'easy', label: 'Facile' },
    { value: 'medium', label: 'Moyen' },
    { value: 'hard', label: 'Difficile' },
  ];

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    const teacher = user?.role === UserRole.INSTRUCTOR;
    this.isTeacher.set(teacher);
    this.load(teacher);
  }

  load(teacher = this.isTeacher()): void {
    this.loading.set(true);
    this.error.set(null);
    const obs = teacher ? this.examService.getAll() : this.examService.getPublished();
    obs.subscribe({
      next: (list) => { this.exams.set(list); this.loading.set(false); },
      error: (err) => {
        this.error.set(err?.error?.message || err?.message || 'Erreur lors du chargement des examens.');
        this.loading.set(false);
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = { DRAFT: 'Brouillon', PUBLISHED: 'Publi\u00e9', CLOSED: 'Cl\u00f4tur\u00e9' };
    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    if (status === 'PUBLISHED') return 'bg-green-100 text-green-700';
    if (status === 'DRAFT') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-500';
  }

  deleteExam(exam: Exam, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!exam.id) return;
    if (!confirm(`Supprimer l'examen \u00ab\u00a0${exam.title}\u00a0\u00bb ?`)) return;
    this.examService.delete(exam.id).subscribe({
      next: () => this.load(),
      error: () => {},
    });
  }

  generateQuiz(): void {
    const topic = this.quizTopic?.trim();
    if (!topic) { this.quizError.set('Indiquez un th\u00e8me pour le quiz.'); return; }
    this.quizError.set(null);
    this.quizSubmitted.set(null);
    this.generatingQuiz.set(true);
    this.quizService.generate({ topic, difficulty: this.quizDifficulty, numQuestions: this.quizNumQuestions }).subscribe({
      next: (quiz) => { this.generatedQuiz.set(quiz); this.quizAnswers.set({}); this.generatingQuiz.set(false); },
      error: (err) => {
        this.generatingQuiz.set(false);
        this.quizError.set(err?.error?.message || err?.message || 'Impossible de g\u00e9n\u00e9rer le quiz.');
      },
    });
  }

  setQuizAnswer(questionIndex: number, optionIndex: number): void {
    this.quizAnswers.update((m) => ({ ...m, [questionIndex]: optionIndex }));
  }

  getQuizAnswer(questionIndex: number): number | undefined {
    return this.quizAnswers()[questionIndex];
  }

  submitQuiz(): void {
    const quiz = this.generatedQuiz();
    if (!quiz?.questions?.length) return;
    const answers = this.quizAnswers();
    let correct = 0;
    quiz.questions.forEach((q, i) => { if (answers[i] === q.correctIndex) correct++; });
    this.quizSubmitted.set({ correct, total: quiz.questions.length });
  }

  resetQuiz(): void {
    this.generatedQuiz.set(null);
    this.quizAnswers.set({});
    this.quizSubmitted.set(null);
    this.quizError.set(null);
  }
}
