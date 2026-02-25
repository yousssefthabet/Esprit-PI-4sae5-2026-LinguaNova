import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { StudentExamService } from '../../services/student-exam.service';
import type { Exam } from '../../models';
import type { StudentExam } from '../../models';

@Component({
  selector: 'app-exam-copies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './exam-copies.component.html',
  styleUrl: './exam-copies.component.scss',
})
export class ExamCopiesComponent implements OnInit {
  exam = signal<Exam | null>(null);
  submissions = signal<StudentExam[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private studentExamService: StudentExamService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    const examId = Number(id);
    this.examService.getById(examId).subscribe({
      next: (e) => {
        this.exam.set(e);
        this.studentExamService.getByExamId(examId).subscribe({
          next: (list) => {
            this.submissions.set(list);
            this.loading.set(false);
          },
          error: () => {
            this.error.set('Impossible de charger les copies.');
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.error.set('Examen introuvable.');
        this.loading.set(false);
      },
    });
  }

  formatDate(s: string | undefined): string {
    if (!s) return '—';
    try {
      const d = new Date(s);
      return d.toLocaleDateString('fr-FR', { dateStyle: 'short' }) + ' ' + d.toLocaleTimeString('fr-FR', { timeStyle: 'short' });
    } catch {
      return s;
    }
  }
}
