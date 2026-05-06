import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BackendEvent, EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-instructor-events',
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
              <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Instructor</span>
            </div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">My Events</h1>
            <p class="text-gray-400 text-sm font-medium">Only events created by you</p>
          </div>

          <button (click)="createNew()" class="px-6 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all active:scale-[0.98] flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Create event
          </button>
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
            No events yet.
          </div>
        } @else {
          <div class="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm mb-5">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex-1">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Filter by name</label>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    class="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all outline-none text-gray-800 placeholder:text-gray-300 shadow-sm"
                    placeholder="Search events…"
                    [value]="search"
                    (input)="onSearchChange(($any($event.target).value ?? '').toString())"
                  />
                </div>
              </div>
              <div class="text-[11px] font-bold text-gray-400 whitespace-nowrap">
                Showing <span class="text-gray-700">{{ pagedEvents.length }}</span> / {{ filteredEvents.length }}
              </div>
            </div>
          </div>

          @if (filteredEvents.length === 0) {
            <div class="bg-white rounded-3xl border border-gray-100 p-10 text-gray-500 font-bold">
              No events match your search.
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
                          {{ event.event_title.slice(0, 2).toUpperCase() }}
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

                  <div class="flex items-center gap-2 shrink-0">
                    @if (event.event_type === 'REAL_LIFE') {
                      <button
                        type="button"
                        (click)="joinChat(event.id)"
                        class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-all flex items-center gap-2"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h8m-8 4h5m-7 7h10a4 4 0 004-4V7a4 4 0 00-4-4H6a4 4 0 00-4 4v10a4 4 0 004 4z" />
                        </svg>
                        Join chat
                      </button>
                    } @else if (event.event_type === 'LIVE_MEETING') {
                      <button
                        type="button"
                        (click)="joinMeet(event.id)"
                        class="px-4 py-2 rounded-xl bg-purple-600 text-white font-black text-sm hover:bg-purple-700 transition-all flex items-center gap-2"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Join meet
                      </button>
                    }
                    <button
                      type="button"
                      (click)="edit(event.id)"
                      class="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-black text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      (click)="remove(event.id)"
                      [disabled]="deletingId === event.id"
                      class="px-4 py-2 rounded-xl border border-red-200 bg-white text-red-700 font-black text-sm hover:bg-red-50 transition-all disabled:opacity-60 flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v2H9V5a1 1 0 011-1z" />
                      </svg>
                      @if (deletingId === event.id) { Deleting… } @else { Delete }
                    </button>
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
export class InstructorEventsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);

  loading = true;
  errorMessage = '';
  deletingId: number | null = null;
  events: BackendEvent[] = [];
  search = '';

  readonly pageSize = 4;
  page = 1;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = '';

    const instructorId = this.getNumericUserId();
    if (instructorId == null) {
      this.authService.getCurrentUser().subscribe({
        next: () => {
          const refreshedId = this.getNumericUserId();
          if (refreshedId == null) {
            this.loading = false;
            this.errorMessage = 'Cannot determine instructor id. Please login again.';
            return;
          }
          this.loadEvents(refreshedId);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Cannot determine instructor id. Please login again.';
        }
      });
      return;
    }

    this.loadEvents(instructorId);
  }

  private getNumericUserId(): number | null {
    const idRaw = this.authService.currentUserValue?.id;
    const id = idRaw ? Number(idRaw) : NaN;
    return Number.isFinite(id) && id > 0 ? id : null;
  }

  private loadEvents(instructorId: number): void {
    this.eventService.getBackendEventsByInstructorId(instructorId).subscribe({
      next: (events) => {
        this.events = events ?? [];
        this.page = 1;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load events';
        this.loading = false;
      }
    });
  }

  get filteredEvents(): BackendEvent[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.events;
    return this.events.filter(e => (e.event_title ?? '').toLowerCase().includes(q));
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

  setPage(p: number): void {
    this.page = Math.min(Math.max(1, p), this.totalPages);
  }

  onSearchChange(v: string): void {
    this.search = v;
    this.page = 1;
  }

  createNew(): void {
    this.router.navigate(['/event/create']);
  }

  edit(id: number): void {
    this.router.navigate(['/event/edit', id]);
  }

  remove(id: number): void {
    this.deletingId = id;
    this.eventService.deleteBackendEvent(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.events = this.events.filter(e => e.id !== id);
      },
      error: () => {
        this.deletingId = null;
        this.errorMessage = 'Failed to delete event';
      }
    });
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

  goBack(): void {
    this.router.navigate(['/dashboard/instructor']);
  }
}
