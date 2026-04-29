import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ActivityDifficulty,
  ClubAiService,
  ClubDashboardResponse,
  ClubRecommendation,
  ClubSessionAnalysisResponse,
  ClubActivityType,
  GeneratedClubActivityResponse,
  RecommendationStatus
} from '../../../core/services/club-ai.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-club-health-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#F7FAFC]">
      <section class="max-w-[1240px] mx-auto px-4 md:px-8 pt-10 pb-6">
        <a
          routerLink="/admin/dashboard"
          class="inline-flex items-center gap-2 text-[#2D6F6B] font-semibold hover:text-[#235855] transition-colors"
        >
          <span>Back to admin dashboard</span>
        </a>
      </section>

      <section class="max-w-[1240px] mx-auto px-4 md:px-8 pb-16">
        <div class="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.16em] font-black text-[#2D6F6B]">AI Club Health Dashboard</p>
              <h1 class="mt-2 text-3xl md:text-4xl font-black text-[#1F2B3D] tracking-tight">
                {{ dashboard?.clubTitle || 'Club' }}
              </h1>
              <p class="mt-2 text-sm text-gray-500 font-semibold">Club ID/Slug: {{ clubId }}</p>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                (click)="refreshAnalysis()"
                [disabled]="loading || refreshingAnalysis"
                class="h-11 px-5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ refreshingAnalysis ? 'Analyzing...' : 'Refresh Analysis' }}
              </button>
              <button
                type="button"
                (click)="loadDashboard()"
                [disabled]="loading"
                class="h-11 px-5 rounded-xl bg-[#2D6F6B] text-white text-sm font-bold hover:bg-[#235855] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Loading...' : 'Reload Dashboard' }}
              </button>
            </div>
          </div>

          @if (errorMessage) {
            <div class="mt-5 px-4 py-3 rounded-xl border border-red-100 bg-red-50 text-red-700 text-sm font-semibold">
              {{ errorMessage }}
            </div>
          }
        </div>

        @if (dashboard) {
          <div class="mt-8 grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
            <div class="space-y-8">
              <div class="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="text-xs uppercase tracking-[0.16em] font-black text-gray-400">Global Health Score</p>
                    <p class="mt-1 text-5xl font-black text-[#1F2B3D] leading-none">
                      {{ dashboard.healthScore | number:'1.0-1' }}
                      <span class="text-2xl text-gray-400">/ 100</span>
                    </p>
                  </div>
                  <span
                    class="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border"
                    [ngClass]="scoreBadgeClass(dashboard.healthScore)"
                  >
                    {{ scoreLabel(dashboard.healthScore) }}
                  </span>
                </div>

                <div class="mt-5 h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    class="h-full transition-all duration-500"
                    [ngClass]="scoreBarClass(dashboard.healthScore)"
                    [style.width.%]="dashboard.healthScore"
                  ></div>
                </div>

                <p class="mt-4 text-gray-700 font-semibold">{{ dashboard.scoreInterpretation }}</p>
                <p class="mt-2 text-sm text-gray-500">{{ dashboard.summarySentence }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ dashboard.trendSummary }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (metric of metricCards(); track metric.label) {
                  <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <p class="text-xs uppercase tracking-[0.14em] font-black text-gray-400">{{ metric.label }}</p>
                    <p class="mt-2 text-3xl font-black text-[#1F2B3D]">{{ metric.value }}</p>
                  </div>
                }
              </div>

              <div class="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
                <div class="flex items-center justify-between gap-3">
                  <h2 class="text-2xl font-black text-[#1F2B3D]">Participation Trends</h2>
                  <span class="text-xs uppercase tracking-[0.14em] font-black text-gray-400">
                    Last {{ dashboard.participationTrends.length }} sessions
                  </span>
                </div>

                @if (dashboard.participationTrends.length === 0) {
                  <p class="mt-4 text-sm text-gray-500">No trend data available yet.</p>
                } @else {
                  <div class="mt-5 space-y-4">
                    @for (point of dashboard.participationTrends; track point.date) {
                      <div class="rounded-2xl border border-gray-100 p-4">
                        <div class="flex items-center justify-between gap-3 mb-3">
                          <p class="text-sm font-black text-[#1F2B3D]">{{ point.date }}</p>
                          <p class="text-xs text-gray-500 font-semibold">Engagement index {{ point.engagementIndex | number:'1.0-1' }}%</p>
                        </div>

                        <div class="space-y-2">
                          <div>
                            <div class="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
                              <span>Attendance</span>
                              <span>{{ point.attendanceRate | number:'1.0-1' }}%</span>
                            </div>
                            <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div class="h-full bg-[#2D6F6B]" [style.width.%]="point.attendanceRate"></div>
                            </div>
                          </div>
                          <div>
                            <div class="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
                              <span>Speaking</span>
                              <span>{{ point.speakingParticipationRate | number:'1.0-1' }}%</span>
                            </div>
                            <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div class="h-full bg-[#0EA5E9]" [style.width.%]="point.speakingParticipationRate"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <div class="space-y-8">
              <div class="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
                <h2 class="text-xl font-black text-[#1F2B3D]">Detected Issues</h2>
                @if (dashboard.detectedIssues.length === 0) {
                  <p class="mt-3 text-sm text-gray-500">No critical issue detected.</p>
                } @else {
                  <ul class="mt-4 space-y-2">
                    @for (issue of dashboard.detectedIssues; track issue) {
                      <li class="text-sm text-gray-700 font-medium rounded-xl border border-amber-100 bg-amber-50 px-3 py-2">
                        {{ issue }}
                      </li>
                    }
                  </ul>
                }
              </div>

              <div class="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
                <div class="flex items-center justify-between gap-3">
                  <h2 class="text-xl font-black text-[#1F2B3D]">Activity Generator</h2>
                  <span class="text-xs uppercase tracking-[0.14em] font-black text-gray-400">AI</span>
                </div>

                <div class="mt-4 grid grid-cols-1 gap-3">
                  <label class="text-xs uppercase tracking-[0.14em] font-black text-gray-500" for="activityType">Type</label>
                  <select
                    id="activityType"
                    [(ngModel)]="generatorType"
                    class="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-800"
                    aria-label="Activity type"
                  >
                    @for (type of activityTypes; track type) {
                      <option [value]="type">{{ formatEnum(type) }}</option>
                    }
                  </select>

                  <label class="text-xs uppercase tracking-[0.14em] font-black text-gray-500" for="activityDifficulty">Difficulty</label>
                  <select
                    id="activityDifficulty"
                    [(ngModel)]="generatorDifficulty"
                    class="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-800"
                    aria-label="Activity difficulty"
                  >
                    @for (difficulty of difficultyLevels; track difficulty) {
                      <option [value]="difficulty">{{ formatEnum(difficulty) }}</option>
                    }
                  </select>

                  <button
                    type="button"
                    (click)="generateActivity()"
                    [disabled]="generatingActivity"
                    class="mt-2 h-11 rounded-xl bg-[#2D6F6B] text-white text-sm font-bold hover:bg-[#235855] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ generatingActivity ? 'Generating...' : 'Generate Activity' }}
                  </button>
                </div>

                @if (generatedActivity) {
                  <div class="mt-5 rounded-2xl border border-[#DDE9E8] bg-[#F7FBFA] p-4">
                    <p class="text-xs uppercase tracking-[0.14em] font-black text-gray-500">Generated Activity</p>
                    <h3 class="mt-2 text-base font-black text-[#1F2B3D]">{{ generatedActivity.title }}</h3>
                    <p class="mt-1 text-sm text-gray-700">{{ generatedActivity.description }}</p>
                    <div class="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
                      <span class="px-2 py-1 rounded-full bg-white border border-gray-200">{{ formatEnum(generatedActivity.suggestedType) }}</span>
                      <span class="px-2 py-1 rounded-full bg-white border border-gray-200">{{ formatEnum(generatedActivity.difficulty) }}</span>
                    </div>
                    <button
                      type="button"
                      (click)="publishGeneratedActivity()"
                      [disabled]="generatedActivity.published || publishingActivity"
                      class="mt-4 h-10 px-4 rounded-lg border border-[#2D6F6B] text-[#2D6F6B] text-sm font-bold hover:bg-[#2D6F6B] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ publishingActivity ? 'Publishing...' : (generatedActivity.published ? 'Published' : 'Publish Activity') }}
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="mt-8 bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
            <h2 class="text-2xl font-black text-[#1F2B3D]">AI Recommendations</h2>

            @if (dashboard.recommendations.length === 0) {
              <p class="mt-4 text-sm text-gray-500">No recommendations available right now.</p>
            } @else {
              <div class="mt-5 space-y-4">
                @for (recommendation of dashboard.recommendations; track recommendation.id) {
                  <article class="rounded-2xl border border-gray-100 p-4">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 class="text-base font-black text-[#1F2B3D]">{{ recommendation.title }}</h3>
                        <p class="mt-1 text-sm text-gray-700">{{ recommendation.description }}</p>
                        <p class="mt-1 text-xs text-gray-500">{{ recommendation.reasoning }}</p>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <span class="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide border" [ngClass]="priorityClass(recommendation.priority)">
                          {{ recommendation.priority }}
                        </span>
                        <span class="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide border" [ngClass]="statusClass(recommendation.status)">
                          {{ recommendation.status }}
                        </span>
                      </div>
                    </div>

                    <div class="mt-3 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
                      <input
                        type="text"
                        [ngModel]="recommendationNotes[recommendation.id] ?? ''"
                        (ngModelChange)="recommendationNotes[recommendation.id] = $event"
                        placeholder="Optional admin note"
                        class="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-700"
                        [attr.aria-label]="'Admin note for recommendation ' + recommendation.title"
                      >

                      <div class="flex flex-wrap gap-2">
                        <button
                          type="button"
                          (click)="setRecommendationStatus(recommendation, 'SAVED')"
                          [disabled]="updatingRecommendationId === recommendation.id"
                          class="h-9 px-3 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          (click)="setRecommendationStatus(recommendation, 'APPLIED')"
                          [disabled]="updatingRecommendationId === recommendation.id"
                          class="h-9 px-3 rounded-lg border border-emerald-300 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          (click)="setRecommendationStatus(recommendation, 'DISMISSED')"
                          [disabled]="updatingRecommendationId === recommendation.id"
                          class="h-9 px-3 rounded-lg border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </article>
                }
              </div>
            }
          </div>

          <div class="mt-8 bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
            <h2 class="text-2xl font-black text-[#1F2B3D]">Admin Action History</h2>
            @if (dashboard.recentActionHistory.length === 0) {
              <p class="mt-4 text-sm text-gray-500">No recommendation actions recorded yet.</p>
            } @else {
              <div class="mt-5 overflow-x-auto">
                <table class="w-full min-w-[760px]">
                  <thead>
                    <tr class="border-b border-gray-100">
                      <th class="text-left text-xs font-black uppercase tracking-[0.14em] text-gray-400 px-3 py-3">Recommendation</th>
                      <th class="text-left text-xs font-black uppercase tracking-[0.14em] text-gray-400 px-3 py-3">Status</th>
                      <th class="text-left text-xs font-black uppercase tracking-[0.14em] text-gray-400 px-3 py-3">Admin</th>
                      <th class="text-left text-xs font-black uppercase tracking-[0.14em] text-gray-400 px-3 py-3">Note</th>
                      <th class="text-left text-xs font-black uppercase tracking-[0.14em] text-gray-400 px-3 py-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of dashboard.recentActionHistory; track $index) {
                      <tr class="border-b border-gray-50">
                        <td class="px-3 py-3 text-sm text-gray-700 font-semibold">#{{ item.recommendationId }}</td>
                        <td class="px-3 py-3">
                          <span class="px-2 py-1 rounded-full text-xs font-black uppercase tracking-wide border" [ngClass]="statusClass(item.status)">
                            {{ item.status }}
                          </span>
                        </td>
                        <td class="px-3 py-3 text-sm text-gray-600">{{ item.adminId || 'N/A' }}</td>
                        <td class="px-3 py-3 text-sm text-gray-600">{{ item.note || 'No note' }}</td>
                        <td class="px-3 py-3 text-sm text-gray-500">{{ item.actedAt | date:'medium' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        } @else if (loading) {
          <div class="mt-8 rounded-2xl border border-gray-100 bg-white p-6 text-sm font-semibold text-gray-500">
            Loading club AI dashboard...
          </div>
        }
      </section>
    </div>
  `
})
export class ClubHealthDashboardComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly clubAiService = inject(ClubAiService);
  private readonly authService = inject(AuthService);
  private readonly subscriptions = new Subscription();

  readonly activityTypes: ClubActivityType[] = [
    'DISCUSSION_TOPIC',
    'MINI_CHALLENGE',
    'VOCABULARY_GAME',
    'ROLE_PLAY_PROMPT'
  ];
  readonly difficultyLevels: ActivityDifficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  clubId = '';
  loading = false;
  refreshingAnalysis = false;
  generatingActivity = false;
  publishingActivity = false;
  updatingRecommendationId: number | null = null;
  errorMessage = '';

  dashboard: ClubDashboardResponse | null = null;
  generatedActivity: GeneratedClubActivityResponse | null = null;
  recommendationNotes: Partial<Record<number, string>> = {};

  generatorType: ClubActivityType = 'DISCUSSION_TOPIC';
  generatorDifficulty: ActivityDifficulty = 'BEGINNER';

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        const candidate = (params.get('clubId') ?? '').trim();
        if (!candidate) {
          this.errorMessage = 'Club id is missing from route.';
          return;
        }
        this.clubId = candidate;
        this.loadDashboard();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadDashboard(): void {
    if (!this.clubId) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.subscriptions.add(
      this.clubAiService.getClubDashboard(this.clubId).subscribe({
        next: (dashboard) => {
          this.dashboard = dashboard;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load club health dashboard right now.';
        }
      })
    );
  }

  refreshAnalysis(): void {
    if (!this.clubId) {
      return;
    }
    this.refreshingAnalysis = true;
    this.errorMessage = '';

    this.subscriptions.add(
      this.clubAiService.analyzeClubSession(this.clubId).subscribe({
        next: (analysis) => this.applyAnalysisSnapshot(analysis),
        error: () => {
          this.refreshingAnalysis = false;
          this.errorMessage = 'Unable to refresh club analysis.';
        }
      })
    );
  }

  generateActivity(): void {
    if (!this.clubId) {
      return;
    }
    this.generatingActivity = true;
    this.errorMessage = '';

    this.subscriptions.add(
      this.clubAiService
        .generateClubActivity(this.clubId, {
          preferredType: this.generatorType,
          preferredDifficulty: this.generatorDifficulty,
          adminId: this.resolveAdminIdentifier()
        })
        .subscribe({
          next: (activity) => {
            this.generatedActivity = activity;
            this.generatingActivity = false;
          },
          error: () => {
            this.generatingActivity = false;
            this.errorMessage = 'Unable to generate club activity right now.';
          }
        })
    );
  }

  publishGeneratedActivity(): void {
    if (!this.generatedActivity || this.generatedActivity.published) {
      return;
    }
    this.publishingActivity = true;
    this.errorMessage = '';

    this.subscriptions.add(
      this.clubAiService.publishGeneratedActivity(this.generatedActivity.activityId).subscribe({
        next: (activity) => {
          this.generatedActivity = activity;
          this.publishingActivity = false;
          this.loadDashboard();
        },
        error: () => {
          this.publishingActivity = false;
          this.errorMessage = 'Unable to publish generated activity.';
        }
      })
    );
  }

  setRecommendationStatus(recommendation: ClubRecommendation, status: RecommendationStatus): void {
    this.updatingRecommendationId = recommendation.id;
    this.errorMessage = '';

    const note = (this.recommendationNotes[recommendation.id] ?? '').trim();
    this.subscriptions.add(
      this.clubAiService
        .updateRecommendationStatus(recommendation.id, {
          status,
          adminId: this.resolveAdminIdentifier(),
          note: note || undefined
        })
        .subscribe({
          next: (updated) => {
            this.replaceRecommendation(updated);
            this.updatingRecommendationId = null;
            this.loadDashboard();
          },
          error: () => {
            this.updatingRecommendationId = null;
            this.errorMessage = 'Unable to update recommendation status.';
          }
        })
    );
  }

  metricCards(): Array<{ label: string; value: string }> {
    const metrics = this.dashboard?.metrics;
    if (!metrics) {
      return [];
    }
    return [
      { label: 'Engagement Rate', value: `${metrics.engagementRate.toFixed(1)}%` },
      { label: 'Attendance Rate', value: `${metrics.attendanceRate.toFixed(1)}%` },
      { label: 'Completion Rate', value: `${metrics.activityCompletionRate.toFixed(1)}%` },
      { label: 'Level Progression', value: metrics.averageLevelProgression.toFixed(1) },
      { label: 'Speaking Rate', value: `${metrics.speakingParticipationRate.toFixed(1)}%` },
      { label: 'Inactivity Rate', value: `${metrics.inactivityRate.toFixed(1)}%` }
    ];
  }

  scoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Stable';
    if (score >= 40) return 'At Risk';
    return 'Critical';
  }

  scoreBadgeClass(score: number): string {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (score >= 60) return 'text-cyan-700 bg-cyan-50 border-cyan-100';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-100';
    return 'text-rose-700 bg-rose-50 border-rose-100';
  }

  scoreBarClass(score: number): string {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-cyan-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  }

  priorityClass(priority: string): string {
    if (priority === 'HIGH') return 'text-rose-700 bg-rose-50 border-rose-100';
    if (priority === 'MEDIUM') return 'text-amber-700 bg-amber-50 border-amber-100';
    return 'text-cyan-700 bg-cyan-50 border-cyan-100';
  }

  statusClass(status: string): string {
    if (status === 'APPLIED') return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (status === 'SAVED') return 'text-cyan-700 bg-cyan-50 border-cyan-100';
    if (status === 'DISMISSED') return 'text-rose-700 bg-rose-50 border-rose-100';
    return 'text-amber-700 bg-amber-50 border-amber-100';
  }

  formatEnum(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private applyAnalysisSnapshot(analysis: ClubSessionAnalysisResponse): void {
    if (this.dashboard) {
      this.dashboard = {
        ...this.dashboard,
        healthScore: analysis.healthScore,
        scoreInterpretation: analysis.scoreInterpretation,
        metrics: analysis.metrics,
        detectedIssues: analysis.detectedProblems,
        summarySentence: analysis.summarySentence
      };
    }
    this.refreshingAnalysis = false;
    this.loadDashboard();
  }

  private replaceRecommendation(updatedRecommendation: ClubRecommendation): void {
    if (!this.dashboard) {
      return;
    }
    this.dashboard = {
      ...this.dashboard,
      recommendations: this.dashboard.recommendations.map((item) =>
        item.id === updatedRecommendation.id ? updatedRecommendation : item
      )
    };
  }

  private resolveAdminIdentifier(): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      return 'admin';
    }
    const fullName = `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim();
    if (fullName) {
      return fullName;
    }
    if (currentUser.email) {
      return currentUser.email;
    }
    return String(currentUser.id || 'admin');
  }
}
