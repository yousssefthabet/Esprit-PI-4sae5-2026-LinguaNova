import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { StudentExamService } from '../../../core/services/student-exam.service';
import { Exam } from '../../../core/models/exam.model';
import { StudentExam } from '../../../core/models/exam-student-exam.model';

@Component({
  selector: 'app-exam-copies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-copies.component.html',
  styleUrls: ['./exam-copies.component.scss'],
})
export class ExamCopiesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private examService = inject(ExamService);
  private studentExamService = inject(StudentExamService);

  exam = signal<Exam | null>(null);
  copies = signal<StudentExam[]>([]);
  loading = signal(true);
  error = signal('');

  private examId!: number;

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.examService.getById(this.examId).subscribe({
      next: (exam) => {
        this.exam.set(exam);
        this.studentExamService.getByExamIdWithDetails(this.examId).subscribe({
          next: (copies) => { this.copies.set(copies); this.loading.set(false); },
          error: () => { this.error.set('Erreur lors du chargement des copies.'); this.loading.set(false); }
        });
      },
      error: () => { this.error.set('Erreur lors du chargement de l\'examen.'); this.loading.set(false); }
    });
  }

  getPercentage(copy: StudentExam): number {
    const max = this.exam()?.maxScore;
    if (!max || max === 0) return 0;
    return Math.round(((copy.score ?? 0) / max) * 100);
  }

  getGradeColor(pct: number): string {
    if (pct >= 75) return 'text-green-600';
    if (pct >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }
}
