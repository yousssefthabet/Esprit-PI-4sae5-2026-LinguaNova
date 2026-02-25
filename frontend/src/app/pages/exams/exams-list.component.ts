import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { QuizService } from '../../services/quiz.service';
import type { Exam } from '../../models';
import type { GeneratedQuizResponse, GeneratedQuestionDto } from '../../models/generated-quiz.model';

@Component({
  selector: 'app-exams-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './exams-list.component.html',
  styleUrl: './exams-list.component.scss',
})
export class ExamsListComponent implements OnInit {
  exams = signal<Exam[]>([]);
  allExams = signal<Exam[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  teacherView = signal(false);

  // Generate Quiz (Gemini)
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

  constructor(
    private examService: ExamService,
    private quizService: QuizService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.teacherView.set(params['gestion'] === '1');
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.examService.getPublished().subscribe({
      next: (list) => {
        this.exams.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Published exams load failed:', err);
        this.error.set(err?.error?.message || err?.message || 'Erreur lors du chargement des examens publiés.');
        this.loading.set(false);
      },
    });

    if (this.teacherView()) {
      this.examService.getAll().subscribe({
        next: (list) => this.allExams.set(list),
        error: (err) => {
          console.error('All exams load failed:', err);
        },
      });
    }
  }

  toggleTeacherView(): void {
    const next = !this.teacherView();
    this.teacherView.set(next);
    if (next) {
      this.examService.getAll().subscribe({
        next: (list) => this.allExams.set(list),
        error: () => { },
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      DRAFT: 'Brouillon',
      PUBLISHED: 'Publié',
      CLOSED: 'Clôturé',
    };
    return labels[status] ?? status;
  }

  deleteExam(exam: Exam, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!exam.id) return;
    if (!confirm(`Supprimer l'examen « ${exam.title} » ?`)) return;
    this.examService.delete(exam.id).subscribe({
      next: () => this.load(),
      error: () => { },
    });
  }

  generateQuiz(): void {
    const topic = this.quizTopic?.trim();
    if (!topic) {
      this.quizError.set('Indiquez un thème pour le quiz.');
      return;
    }
    this.quizError.set(null);
    this.quizSubmitted.set(null);
    this.generatingQuiz.set(true);
    this.quizService
      .generate({
        topic,
        difficulty: this.quizDifficulty,
        numQuestions: this.quizNumQuestions,
      })
      .subscribe({
        next: (quiz) => {
          this.generatedQuiz.set(quiz);
          this.quizAnswers.set({});
          this.generatingQuiz.set(false);
        },
        error: (err) => {
          this.generatingQuiz.set(false);
          this.quizError.set(
            err?.error?.message || err?.message || 'Impossible de générer le quiz. Vérifiez le serveur et la clé Gemini.'
          );
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
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    this.quizSubmitted.set({ correct, total: quiz.questions.length });
  }

  resetQuiz(): void {
    this.generatedQuiz.set(null);
    this.quizAnswers.set({});
    this.quizSubmitted.set(null);
    this.quizError.set(null);
  }
}
