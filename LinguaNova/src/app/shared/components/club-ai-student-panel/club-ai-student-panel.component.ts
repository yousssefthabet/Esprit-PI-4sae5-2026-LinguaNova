import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import {
  ClubActivityFeedItem,
  ClubAiService,
  StudentClubInsightResponse
} from '../../../core/services/club-ai.service';

@Component({
  selector: 'app-club-ai-student-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mt-8 bg-white border border-gray-100 rounded-3xl shadow-sm p-5 md:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.14em] font-black text-[#2D6F6B]">My Club Participation</p>
          <h3 class="text-xl font-black text-[#1F2B3D]">AI Student Insights</h3>
        </div>
        <button
          type="button"
          (click)="loadPanelData()"
          [disabled]="loading || !clubId"
          class="h-10 px-4 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Refresh club AI insights"
        >
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      @if (errorMessage) {
        <div class="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700 font-semibold">
          {{ errorMessage }}
        </div>
      }

      @if (insights) {
        <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <article class="rounded-2xl border border-[#DDE9E8] bg-[#F7FBFA] p-4">
            <p class="text-xs uppercase tracking-[0.12em] text-gray-500 font-black">Engagement Level</p>
            <p class="mt-2 text-xl font-black text-[#1F2B3D]">{{ insights.engagementLevel }}</p>
          </article>
          <article class="rounded-2xl border border-[#DDE9E8] bg-[#F7FBFA] p-4">
            <p class="text-xs uppercase tracking-[0.12em] text-gray-500 font-black">Engagement Score</p>
            <p class="mt-2 text-xl font-black text-[#1F2B3D]">{{ insights.engagementScore | number:'1.0-1' }}/100</p>
          </article>
          <article class="rounded-2xl border border-[#DDE9E8] bg-[#F7FBFA] p-4">
            <p class="text-xs uppercase tracking-[0.12em] text-gray-500 font-black">Pending Activities</p>
            <p class="mt-2 text-xl font-black text-[#1F2B3D]">{{ insights.pendingActivities }}</p>
          </article>
        </div>

        <div class="mt-5 rounded-2xl border border-gray-100 p-4">
          <p class="text-xs uppercase tracking-[0.12em] text-gray-500 font-black">Suggested Next Action</p>
          <p class="mt-2 text-sm text-gray-700 font-semibold">{{ insights.suggestedNextAction }}</p>
          <p class="mt-3 text-xs uppercase tracking-[0.12em] text-gray-500 font-black">Next Recommended Session</p>
          <p class="mt-1 text-sm text-gray-600">{{ insights.nextRecommendedSession }}</p>
        </div>

        <div class="mt-5">
          <p class="text-xs uppercase tracking-[0.12em] text-gray-500 font-black">AI Suggestions</p>
          @if (insights.aiSuggestions.length === 0) {
            <p class="mt-2 text-sm text-gray-500">No suggestion available right now.</p>
          } @else {
            <ul class="mt-2 space-y-2">
              @for (suggestion of insights.aiSuggestions; track suggestion) {
                <li class="rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-sm text-cyan-900">
                  {{ suggestion }}
                </li>
              }
            </ul>
          }
        </div>
      }

      <div class="mt-6">
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs uppercase tracking-[0.12em] text-gray-500 font-black">Club Activity Feed</p>
          <span class="text-xs font-semibold text-gray-400">{{ activityFeed.length }} items</span>
        </div>

        @if (activityFeed.length === 0) {
          <div class="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3 text-sm text-gray-500">
            No published AI activity yet.
          </div>
        } @else {
          <div class="mt-3 space-y-3">
            @for (item of activityFeed; track item.id) {
              <article class="rounded-xl border border-gray-100 p-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <h4 class="text-sm font-black text-[#1F2B3D]">{{ item.title }}</h4>
                  <div class="flex flex-wrap gap-2 text-[11px]">
                    <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">{{ formatEnum(item.type) }}</span>
                    <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">{{ formatEnum(item.difficulty) }}</span>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-600">{{ item.description }}</p>

                <div class="mt-3">
                  <div class="flex items-center justify-between text-xs text-gray-500 font-semibold">
                    <span>Completion</span>
                    <span>{{ item.completionRate | number:'1.0-1' }}%</span>
                  </div>
                  <div class="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full bg-[#2D6F6B]" [style.width.%]="item.completionRate"></div>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>
  `
})
export class ClubAiStudentPanelComponent implements OnChanges, OnDestroy {
  private readonly clubAiService = inject(ClubAiService);
  private readonly authService = inject(AuthService);
  private readonly subscriptions = new Subscription();

  @Input({ required: true }) clubId = '';

  loading = false;
  errorMessage = '';
  insights: StudentClubInsightResponse | null = null;
  activityFeed: ClubActivityFeedItem[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clubId'] && this.clubId?.trim()) {
      this.loadPanelData();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPanelData(): void {
    const targetClubId = this.clubId.trim();
    if (!targetClubId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const studentId = this.resolveStudentId();

    const insights$ = this.clubAiService.getStudentInsights(targetClubId, studentId).pipe(
      catchError(() => of(null))
    );
    const feed$ = this.clubAiService.getClubActivities(targetClubId).pipe(
      catchError(() => of([] as ClubActivityFeedItem[]))
    );

    this.subscriptions.add(
      forkJoin({ insights: insights$, feed: feed$ }).subscribe({
        next: ({ insights, feed }) => {
          this.insights = insights;
          this.activityFeed = feed;
          this.loading = false;
          if (!insights) {
            this.errorMessage = 'Student insights are currently unavailable for this club.';
          }
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load club AI student panel.';
        }
      })
    );
  }

  formatEnum(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private resolveStudentId(): number {
    const currentUser = this.authService.currentUserValue;
    const rawId = String(currentUser?.id ?? '').trim();
    const numericId = Number(rawId);
    if (Number.isFinite(numericId) && numericId > 0) {
      return Math.trunc(numericId);
    }

    if (!rawId) {
      return 1;
    }

    let hash = 0;
    for (let index = 0; index < rawId.length; index += 1) {
      hash = (hash * 31 + rawId.charCodeAt(index)) % 2147483647;
    }
    return Math.max(1, hash);
  }
}
