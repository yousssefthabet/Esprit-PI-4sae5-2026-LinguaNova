import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BackendEvent, EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-student-joined-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen py-12 font-sans">
      <div class="container mx-auto px-4 max-w-[1200px]">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <button (click)="goBack()" class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0D9488] hover:border-teal-100 transition-all shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <span class="text-gray-300">/</span>
              <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Student</span>
            </div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">My Joined Events</h1>
            <p class="text-gray-400 text-sm font-medium">Events you already joined</p>
          </div>
        </div>

        @if (errorMessage) {
          <div class="mb-6 text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
            {{ errorMessage }}
          </div>
        }

        @if (loading) {
          <div class="bg-white rounded-3xl border border-gray-100 p-10 text-gray-500 font-bold">
            Loading events...
          </div>
        } @else if (events.length === 0) {
          <div class="bg-white rounded-3xl border border-gray-100 p-10 text-gray-500 font-bold">
            You haven't joined any event yet.
          </div>
        } @else {
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <button
              type="button"
              (click)="setFilter('all')"
              class="px-5 py-2 rounded-full border-2 font-black text-xs uppercase tracking-widest transition-all shadow-sm"
              [class]="filterType === 'all'
                ? 'bg-white border-[#0D9488] text-[#0D9488]'
                : 'bg-[#F1F5F9] border-transparent text-gray-500 hover:bg-white hover:border-gray-200'"
            >
              All
            </button>
            <button
              type="button"
              (click)="setFilter('REAL_LIFE')"
              class="px-5 py-2 rounded-full border-2 font-black text-xs uppercase tracking-widest transition-all shadow-sm"
              [class]="filterType === 'REAL_LIFE'
                ? 'bg-white border-emerald-600 text-emerald-700'
                : 'bg-[#F1F5F9] border-transparent text-gray-500 hover:bg-white hover:border-gray-200'"
            >
              Real life
            </button>
            <button
              type="button"
              (click)="setFilter('LIVE_MEETING')"
              class="px-5 py-2 rounded-full border-2 font-black text-xs uppercase tracking-widest transition-all shadow-sm"
              [class]="filterType === 'LIVE_MEETING'
                ? 'bg-white border-purple-600 text-purple-700'
                : 'bg-[#F1F5F9] border-transparent text-gray-500 hover:bg-white hover:border-gray-200'"
            >
              Live meeting
            </button>

            <div class="ml-auto text-[11px] font-bold text-gray-400">
              Showing <span class="text-gray-700">{{ pagedEvents.length }}</span> / {{ filteredEvents.length }}
            </div>
          </div>

          @if (filteredEvents.length === 0) {
            <div class="bg-white rounded-3xl border border-gray-100 p-10 text-gray-500 font-bold">
              No events in this filter.
            </div>
          } @else {
          <div class="space-y-4">
            @for (event of pagedEvents; track event.id) {
              <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div class="min-w-0 flex items-start gap-5">
                    <div class="w-[120px] h-[90px] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm shrink-0">
                      @if (event.image_url) {
                        <img
                          [src]="event.image_url"
                          [alt]="event.event_title"
                          class="w-full h-full object-cover"
                          (error)="handleImgError($event)"
                        />
                      } @else {
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-white text-teal-700 font-black text-xs">
                          {{ (event.event_title ?? 'Event').slice(0, 2).toUpperCase() }}
                        </div>
                      }
                    </div>

                    <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-3 mb-2">
                      <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                        [class]="event.event_type === 'REAL_LIFE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-purple-50 text-purple-700 border-purple-100'"
                      >
                        {{ event.event_type }}
                      </span>
                      <span class="text-xs font-bold text-gray-400">{{ event.event_date }}</span>
                      <span class="text-gray-300">•</span>
                      <span class="text-xs font-bold text-gray-400">{{ event.start_at }} → {{ event.ends_at }}</span>
                      @if (event.max_attendees) {
                        <span class="text-gray-300">•</span>
                        <span class="text-xs font-bold text-gray-400">Max: {{ event.max_attendees }}</span>
                      }
                    </div>
                    <h3 class="text-xl font-black text-gray-900 truncate">{{ event.event_title }}</h3>
                    <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ event.session_description }}</p>
                    @if (event.event_type === 'REAL_LIFE' && event.location_name) {
                      <p class="text-xs font-bold text-gray-400 mt-2">📍 {{ event.location_name }}</p>
                    }
                    @if (event.event_type === 'LIVE_MEETING' && event.meeting_link) {
                      <p class="text-xs font-bold text-gray-400 mt-2">🔗 {{ event.meeting_link }}</p>
                    }
                    </div>
                  </div>

                  <div class="shrink-0 flex items-center gap-2">
                    @if (event.event_type === 'REAL_LIFE') {
                      <button
                        type="button"
                        (click)="joinChat(event.id)"
                        class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all"
                      >
                        Join chat
                      </button>
                    } @else if (event.event_type === 'LIVE_MEETING') {
                      <button
                        type="button"
                        (click)="joinMeet(event.id)"
                        class="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all"
                      >
                        Join meet
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="mt-8 flex flex-col items-center gap-3">
            <div class="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                (click)="setPage(page - 1)"
                [disabled]="page <= 1"
                class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-50"
                aria-label="Previous page"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              @for (p of pages; track p) {
                <button
                  type="button"
                  (click)="setPage(p)"
                  class="w-10 h-10 flex items-center justify-center rounded-lg font-black shadow-sm transition-colors border"
                  [class]="p === page
                    ? 'bg-[#0D9488] text-white border-transparent'
                    : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'"
                >
                  {{ p }}
                </button>
              }

              <button
                type="button"
                (click)="setPage(page + 1)"
                [disabled]="page >= totalPages"
                class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-50"
                aria-label="Next page"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div class="text-gray-400 text-sm font-medium text-center">
              Page {{ page }} of {{ totalPages }}
            </div>
          </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class StudentJoinedEventsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);

  loading = true;
  errorMessage = '';
  events: BackendEvent[] = [];

  filterType: 'all' | 'REAL_LIFE' | 'LIVE_MEETING' = 'all';
  readonly pageSize = 4;
  page = 1;

  get filteredEvents(): BackendEvent[] {
    if (this.filterType === 'all') return this.events;
    return this.events.filter(e => e.event_type === this.filterType);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEvents.length / this.pageSize));
  }

  get pagedEvents(): BackendEvent[] {
    const p = Math.min(Math.max(1, this.page), this.totalPages);
    const start = (p - 1) * this.pageSize;
    return this.filteredEvents.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = Math.min(Math.max(1, this.page), total);
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    const s2 = Math.max(1, end - 4);
    const out: number[] = [];
    for (let i = s2; i <= end; i += 1) out.push(i);
    return out;
  }

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = '';

    const idRaw = this.authService.currentUserValue?.id;
    const studentId = idRaw ? Number(idRaw) : NaN;
    if (!Number.isFinite(studentId)) {
      this.loading = false;
      this.errorMessage = 'Cannot determine student id. Please login again.';
      return;
    }

    this.eventService.getBackendEventsJoinedByStudentId(studentId).subscribe({
      next: (events) => {
        this.events = events ?? [];
        this.page = 1;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load joined events';
        this.loading = false;
      }
    });
  }

  setFilter(type: 'all' | 'REAL_LIFE' | 'LIVE_MEETING'): void {
    this.filterType = type;
    this.page = 1;
  }

  setPage(p: number): void {
    this.page = Math.min(Math.max(1, p), this.totalPages);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/student']);
  }

  joinChat(eventId: number): void {
    this.router.navigate(['/event/chat', eventId]);
  }

  joinMeet(eventId: number): void {
    this.router.navigate(['/event/meet', eventId]);
  }

  handleImgError(e: Event): void {
    const img = e.target as HTMLImageElement | null;
    if (img) img.style.display = 'none';
  }
}

