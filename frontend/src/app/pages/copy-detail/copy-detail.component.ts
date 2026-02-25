import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StudentExamService } from '../../services/student-exam.service';
import { StudentAnswerService } from '../../services/student-answer.service';
import type { StudentExam } from '../../models';
import type { StudentAnswer } from '../../models';

@Component({
  selector: 'app-copy-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './copy-detail.component.html',
  styleUrl: './copy-detail.component.scss',
})
export class CopyDetailComponent implements OnInit {
  submission = signal<StudentExam | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  saving = signal(false);

  scoreOverride = signal<number | null>(null);
  teacherComments = signal<Record<number, string>>({});

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentExamService: StudentExamService,
    private studentAnswerService: StudentAnswerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('submissionId');
    if (!id) {
      this.router.navigate(['/examens']);
      return;
    }
    this.studentExamService.getById(Number(id)).subscribe({
      next: (s) => {
        this.submission.set(s);
        this.scoreOverride.set(s.score ?? null);
        const comments: Record<number, string> = {};
        (s.answers ?? []).forEach((a) => {
          if (a.id) comments[a.id] = a.teacherComment ?? '';
        });
        this.teacherComments.set(comments);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Copie introuvable.');
        this.loading.set(false);
      },
    });
  }

  setComment(answerId: number, value: string): void {
    this.teacherComments.update((m) => ({ ...m, [answerId]: value }));
  }

  setScore(value: number | string): void {
    const n = typeof value === 'string' ? parseFloat(value) : value;
    this.scoreOverride.set(Number.isNaN(n) ? null : n);
  }

  saveCorriges(): void {
    const s = this.submission();
    if (!s?.id) return;
    this.saving.set(true);
    const comments = this.teacherComments();
    const answers = s.answers ?? [];
    const toUpdate = answers.filter((a) => a.id && comments[a.id] !== undefined);
    const updateCalls = toUpdate.map((a) =>
      this.studentAnswerService.update(a.id!, { ...a, teacherComment: comments[a.id!] })
    );
    const score = this.scoreOverride() ?? s.score;
    const payload = { ...s, score, validated: true };
    (updateCalls.length > 0
      ? forkJoin(updateCalls).pipe(switchMap(() => this.studentExamService.update(s.id!, payload)))
      : this.studentExamService.update(s.id!, payload)
    ).subscribe({
      next: () => {
        this.saving.set(false);
        this.submission.update((prev) => (prev ? { ...prev, score, validated: true } : null));
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  validateOnly(): void {
    const s = this.submission();
    if (!s?.id) return;
    this.saving.set(true);
    const score = this.scoreOverride() ?? s.score;
    this.studentExamService.update(s.id, { ...s, score, validated: true }).subscribe({
      next: () => {
        this.saving.set(false);
        this.submission.update((prev) => (prev ? { ...prev, score, validated: true } : null));
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  formatDate(val: string | undefined): string {
    if (!val) return '—';
    try {
      const d = new Date(val);
      return d.toLocaleDateString('fr-FR', { dateStyle: 'short' }) + ' ' + d.toLocaleTimeString('fr-FR', { timeStyle: 'short' });
    } catch {
      return val;
    }
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = { QCM: 'QCM', TRUE_FALSE: 'Vrai/Faux', TEXT: 'Réponse libre' };
    return labels[type] ?? type;
  }

  answerText(a: StudentAnswer): string {
    if (a.textAnswer) return a.textAnswer;
    if (a.selectedReponse?.content) return a.selectedReponse.content;
    return '—';
  }
}
