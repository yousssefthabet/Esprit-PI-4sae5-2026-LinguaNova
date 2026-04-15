import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BackendEvent, EventService } from '../../core/services/event.service';

interface CalendarDay {
  day: number;
  isToday?: boolean;
  isCurrentMonth?: boolean;
  events?: CalendarEvent[];
}

interface CalendarEvent {
  title: string;
  time: string;
  type: 'live' | 'deadline' | 'event';
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 min-h-screen pb-20">
      <!-- Header Section -->
      <section class="bg-white border-b border-gray-100 py-12">
        <div class="container mx-auto px-4">
          <div class="flex flex-col gap-6">
            <div class="flex items-start justify-between gap-4">
              <button
                (click)="goBack()"
                class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl transition-colors font-black text-sm shadow-sm"
              >
                <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6"></path>
                </svg>
                <span>Back</span>
              </button>

              <div class="text-center flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">My Learning Schedule</h1>
                <p class="text-gray-600">{{ monthLabel() }}</p>
              </div>

              <!-- spacer to keep title centered -->
              <div class="w-[92px] hidden md:block"></div>
            </div>

            <div class="flex gap-3 justify-center md:justify-end">
              <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-bold text-sm">
                Previous
              </button>
              <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-bold text-sm">
                Today
              </button>
              <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-bold text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Calendar Grid -->
      <main class="container mx-auto px-4 py-12">
        <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <!-- Weekdays Header -->
          <div class="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
            @for (day of weekDays; track day) {
              <div class="py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                {{ day }}
              </div>
            }
          </div>

          <!-- Days Grid -->
          <div class="grid grid-cols-7">
            @for (day of days(); track $index) {
              <div 
                class="min-h-[160px] p-4 border-r border-b border-gray-50 last:border-r-0 relative group transition-colors hover:bg-gray-50/30"
                [class.bg-blue-50/20]="day.isToday"
              >
                <span 
                  class="text-sm font-bold flex items-center justify-center w-8 h-8 rounded-full mb-2 transition-colors"
                  [class.bg-primary]="day.isToday"
                  [class.text-white]="day.isToday"
                  [class.text-gray-900]="!day.isToday && day.isCurrentMonth"
                  [class.text-gray-300]="!day.isCurrentMonth"
                >
                  {{ day.day }}
                </span>

                <div class="space-y-1.5 pt-1">
                  @for (event of day.events; track event.title) {
                    <div 
                      class="px-2 py-1 rounded-lg text-[10px] font-bold border truncate"
                      [class.bg-primary/10]="event.type === 'live'"
                      [class.text-primary]="event.type === 'live'"
                      [class.border-primary/20]="event.type === 'live'"
                      [class.bg-red-50]="event.type === 'deadline'"
                      [class.text-red-600]="event.type === 'deadline'"
                      [class.border-red-100]="event.type === 'deadline'"
                      [class.bg-orange-50]="event.type === 'event'"
                      [class.text-orange-600]="event.type === 'event'"
                      [class.border-orange-100]="event.type === 'event'"
                    >
                      <span class="opacity-70 mr-1">{{ event.time }}</span>
                      {{ event.title }}
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Legend -->
        <div class="mt-8 flex flex-wrap gap-6 justify-center">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-primary/20 border border-primary/20"></span>
            <span class="text-sm font-medium text-gray-600">Live meeting (joined)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-50 border border-red-100"></span>
            <span class="text-sm font-medium text-gray-600">Course Deadline</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-orange-50 border border-orange-100"></span>
            <span class="text-sm font-medium text-gray-600">Community Event</span>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class CalendarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly eventService = inject(EventService);

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  private readonly viewDate = signal(new Date());
  private readonly joinedLiveMeetings = signal<BackendEvent[]>([]);

  readonly monthLabel = computed(() => {
    const d = this.viewDate();
    return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  });

  readonly days = computed<CalendarDay[]>(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth(); // 0-based
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const startWeekday = first.getDay(); // 0..6, Sunday start
    const daysInMonth = last.getDate();

    // Start from previous month to fill first week
    const prevLast = new Date(year, month, 0).getDate();
    const out: CalendarDay[] = [];

    const today = new Date();
    const isSameMonth = today.getFullYear() === year && today.getMonth() === month;

    const byDay: Record<number, CalendarEvent[]> = {};
    for (const ev of this.joinedLiveMeetings()) {
      const dateStr = (ev.event_date ?? '').trim();
      if (!dateStr) continue;
      const d = new Date(`${dateStr}T00:00:00`);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      const dayNum = d.getDate();
      const time = (ev.start_at ?? '').slice(0, 5) || '—';
      (byDay[dayNum] ??= []).push({
        title: ev.event_title,
        time,
        type: 'live'
      });
    }

    for (let i = 0; i < startWeekday; i += 1) {
      out.push({ day: prevLast - (startWeekday - 1 - i), isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      out.push({
        day,
        isCurrentMonth: true,
        isToday: isSameMonth && day === today.getDate(),
        events: byDay[day] ?? []
      });
    }

    // Fill remaining cells to complete a 6-row grid (42 cells)
    while (out.length < 42) {
      out.push({ day: out.length - (startWeekday + daysInMonth) + 1, isCurrentMonth: false });
    }
    return out;
  });

  ngOnInit(): void {
    const idRaw = this.authService.currentUserValue?.id;
    const studentId = idRaw ? Number(idRaw) : NaN;
    if (!Number.isFinite(studentId)) return;

    this.eventService.getBackendEventsJoinedByStudentId(studentId).subscribe({
      next: (events) => {
        const live = (events ?? []).filter(e => e.event_type === 'LIVE_MEETING');
        this.joinedLiveMeetings.set(live);
      },
      error: () => {
        this.joinedLiveMeetings.set([]);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/student']);
  }
}
