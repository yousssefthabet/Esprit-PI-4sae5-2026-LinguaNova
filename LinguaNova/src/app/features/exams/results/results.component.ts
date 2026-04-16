import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentExamService } from '../../../core/services/student-exam.service';
import { AuthService } from '../../../core/services/auth.service';
import { CertificateService } from '../../../core/services/certificate.service';
import { StudentExam } from '../../../core/models/exam-student-exam.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  private studentExamService = inject(StudentExamService);
  private authService = inject(AuthService);
  private certificateService = inject(CertificateService);

  results = signal<StudentExam[]>([]);
  loading = signal(true);
  error = signal('');
  selectedUserId = signal<number | null>(null);

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    const currentUserId = currentUser && currentUser.id ? Number(currentUser.id) : NaN;
    if (Number.isNaN(currentUserId)) {
      this.error.set('Utilisateur non connecté.');
      this.loading.set(false);
      return;
    }
    this.selectedUserId.set(currentUserId);
    this.loadResults(currentUserId);
  }

  loadResults(userId: number): void {
    this.loading.set(true);
    this.selectedUserId.set(userId);
    this.studentExamService.getByUserId(userId).subscribe({
      next: (res) => { this.results.set(res); this.loading.set(false); },
      error: () => { this.error.set('Erreur lors du chargement des résultats.'); this.loading.set(false); }
    });
  }

  getMaxScore(result: StudentExam): number {
    if (result.exam?.maxScore && result.exam.maxScore > 0) {
      return result.exam.maxScore;
    }
    if (result.exam?.questions && result.exam.questions.length > 0) {
      return result.exam.questions.reduce((sum, q) => sum + (q.score ?? 0), 0);
    }
    if (result.answers && result.answers.length > 0) {
      // Pour les anciens examens où maxScore = 0, on additionne le score des questions répondues
      return result.answers.reduce((sum, a) => sum + (a.question?.score ?? 0), 0);
    }
    return 0; // Fallback final
  }

  getPercentage(result: StudentExam): number {
    const max = this.getMaxScore(result);
    if (!max || max === 0) return 0;
    return Math.round(((result.score ?? 0) / max) * 100);
  }

  getGradeColor(pct: number): string {
    if (pct >= 75) return 'text-green-600';
    if (pct >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }

  downloadCertificate(result: StudentExam): void {
    if (!result.id) return;
    
    this.certificateService.generate(result.id).subscribe({
      next: (cert) => {
        if (cert.id) {
          this.certificateService.downloadPdf(cert.id).subscribe((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = cert.pdfFileName || 'certificat.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
          });
        }
      },
      error: () => alert('Certificat non disponible pour cet examen (Score insuffisant ou non validé).')
    });
  }
}
