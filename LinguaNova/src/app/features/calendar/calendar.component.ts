import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">My Learning Schedule</h1>
              <p class="text-gray-600">February 2026</p>
            </div>
            <div class="flex gap-3">
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
            @for (day of days; track day.day) {
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
            <span class="text-sm font-medium text-gray-600">Live Class</span>
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
export class CalendarComponent {
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  days: CalendarDay[] = [
    { day: 26, isCurrentMonth: false },
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    {
      day: 1,
      isCurrentMonth: true,
      events: [{ title: 'UI Fundamentals', time: '10:00 AM', type: 'live' }]
    },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    {
      day: 4,
      isCurrentMonth: true,
      events: [{ title: 'Design Quiz', time: '11:59 PM', type: 'deadline' }]
    },
    { day: 5, isCurrentMonth: true },
    {
      day: 6,
      isCurrentMonth: true,
      events: [{ title: 'Community Mixer', time: '6:00 PM', type: 'event' }]
    },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    {
      day: 10,
      isCurrentMonth: true,
      events: [{ title: 'Advanced JS', time: '2:00 PM', type: 'live' }]
    },
    { day: 11, isCurrentMonth: true, isToday: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    {
      day: 17,
      isCurrentMonth: true,
      events: [{ title: 'Final Project', time: '11:59 PM', type: 'deadline' }]
    },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    {
      day: 20,
      isCurrentMonth: true,
      events: [{ title: 'Web Careers Talk', time: '4:00 PM', type: 'event' }]
    },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    {
      day: 24,
      isCurrentMonth: true,
      events: [{ title: 'React Performance', time: '3:00 PM', type: 'live' }]
    },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
  ];
}
