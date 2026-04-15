import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { StudentExamService } from '../../../core/services/student-exam.service';
import { StudentAnswerService } from '../../../core/services/student-answer.service';
import { StudentExam } from '../../../core/models/exam-student-exam.model';
import { StudentAnswer } from '../../../core/models/exam-student-answer.model';

@Component({
  selector: 'app-copy-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './copy-detail.component.html',
  styleUrls: ['./copy-detail.component.scss'],
})
export class CopyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private studentExamService = inject(StudentExamService);
  private studentAnswerService = inject(StudentAnswerService);

  studentExam = signal<StudentExam | null>(null);
  answers = signal<StudentAnswer[]>([]);
  loading = signal(true);
  error = signal('');
  saving = signal(false);
  saveSuccess = signal(false);

  submissionId!: number;

  ngOnInit(): void {
    this.submissionId = Number(this.route.snapshot.paramMap.get('submissionId'));
    this.studentExamService.getByIdWithDetails(this.submissionId).subscribe({
      next: (se) => {
        this.studentExam.set(se);
        this.answers.set(se.answers ?? []);
        this.loading.set(false);
      },
      error: () => { this.error.set('Erreur lors du chargement de la copie.'); this.loading.set(false); }
    });
  }

  saveComments(): void {
    this.saving.set(true);
    this.saveSuccess.set(false);
    const updates = this.answers().map(a =>
      this.studentAnswerService.update(a.id!, a)
    );
    forkJoin(updates).subscribe({
      next: () => { this.saving.set(false); this.saveSuccess.set(true); setTimeout(() => this.saveSuccess.set(false), 3000); },
      error: () => { this.error.set('Erreur lors de la sauvegarde des commentaires.'); this.saving.set(false); }
    });
  }

  updateComment(answerId: number, comment: string): void {
    this.answers.update(list => list.map(a => a.id === answerId ? { ...a, teacherComment: comment } : a));
  }

  getDisplayAnswer(answer: StudentAnswer): string {
    if (answer.selectedReponse) return answer.selectedReponse.content ?? '';
    return answer.textAnswer ?? '(Pas de réponse)';
  }

  getMaxScore(): number {
    const se = this.studentExam();
    if (!se) return 0;
    if (se.exam?.maxScore && se.exam.maxScore > 0) {
      return se.exam.maxScore;
    }
    if (se.exam?.questions && se.exam.questions.length > 0) {
      return se.exam.questions.reduce((sum, q) => sum + (q.score ?? 0), 0);
    }
    const ansList = this.answers();
    if (ansList && ansList.length > 0) {
      return ansList.reduce((sum, a) => sum + (a.question?.score ?? 0), 0);
    }
    return 0;
  }

  getPercentage(): number {
    const max = this.getMaxScore();
    const score = this.studentExam()?.score;
    if (!max || max === 0 || score == null) return 0;
    return Math.round((score / max) * 100);
  }
}
