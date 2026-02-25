import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import type { Exam } from '../../models';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './exam-detail.component.html',
  styleUrl: './exam-detail.component.scss',
})
export class ExamDetailComponent implements OnInit {
  exam = signal<Exam | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/examens']);
      return;
    }
    this.examService.getById(Number(id)).subscribe({
      next: (e) => {
        this.exam.set(e);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Examen introuvable.');
        this.loading.set(false);
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      DRAFT: 'Brouillon',
      PUBLISHED: 'Publié',
      CLOSED: 'Clôturé',
    };
    return labels[status] ?? status;
  }

  canTakeExam(e: Exam): boolean {
    return e.examStatus === 'PUBLISHED';
  }
}
