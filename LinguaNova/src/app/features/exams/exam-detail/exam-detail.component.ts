import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import type { Exam } from '../../../core/models/exam.model';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './exam-detail.component.html',
  styleUrl: './exam-detail.component.scss',
})
export class ExamDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);
  private authService = inject(AuthService);

  exam = signal<Exam | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isTeacher = signal(false);

  ngOnInit(): void {
    this.isTeacher.set(this.authService.currentUserValue?.role === UserRole.INSTRUCTOR);
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/examens']); return; }
    this.examService.getById(Number(id)).subscribe({
      next: (e) => { this.exam.set(e); this.loading.set(false); },
      error: () => { this.error.set('Examen introuvable.'); this.loading.set(false); },
    });
  }

  deleteExam(): void {
    const e = this.exam();
    if (!e?.id || !confirm(`Supprimer l'examen « ${e.title} » ?`)) return;
    this.examService.delete(e.id).subscribe({ next: () => this.router.navigate(['/examens']), error: () => {} });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = { DRAFT: 'Brouillon', PUBLISHED: 'Publié', CLOSED: 'Clôturé' };
    return labels[status] ?? status;
  }

  canTakeExam(e: Exam): boolean {
    return e.examStatus === 'PUBLISHED';
  }
}
