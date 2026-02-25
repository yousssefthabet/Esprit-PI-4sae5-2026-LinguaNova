import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { StudentProfileService } from '../../services/student-profile.service';
import { StudentExamService } from '../../services/student-exam.service';
import type { StudentProfile } from '../../models';
import type { StudentExam } from '../../models';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  profiles = signal<StudentProfile[]>([]);
  selectedProfileId = signal<number | null>(null);
  results = signal<StudentExam[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  highlightId = signal<number | null>(null);

  constructor(
    private profileService: StudentProfileService,
    private studentExamService: StudentExamService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const h = params['highlight'];
      if (h) this.highlightId.set(Number(h));
    });
    this.profileService.getAll().subscribe({
      next: (list) => {
        this.profiles.set(list);
        const first = list[0];
        if (first?.id) {
          this.selectedProfileId.set(first.id);
          this.loadResults(first.id);
        } else {
          this.loading.set(false);
        }
      },
      error: () => {
        this.error.set('Impossible de charger les profils.');
        this.loading.set(false);
      },
    });
  }

  onProfileChange(profileIdStr: string): void {
    const id = profileIdStr ? Number(profileIdStr) : null;
    this.selectedProfileId.set(id);
    if (id) this.loadResults(id);
    else this.results.set([]);
  }

  loadResults(profileId: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.studentExamService.getByStudentProfileId(profileId).subscribe({
      next: (list) => {
        console.log('Résultats reçus:', list);
        this.results.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des résultats:', err);
        this.error.set('Impossible de charger les résultats.');
        this.loading.set(false);
      },
    });
  }
}
