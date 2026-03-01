import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

const LESSON_COLORS = ['#2BBCB0', '#E67E22', '#2C3E50', '#E87B7B'] as const;

@Component({
    selector: 'app-course-flow',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="flex min-h-screen bg-[#F4F6F8]">
      <!-- Left Sidebar ~210px -->
      <aside class="w-[215px] shrink-0 bg-gray flex flex-col border-r border-gray-100 ml-10">
        <div class="p-4">
          <a routerLink="/courses" class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#2BBCB0] text-white hover:opacity-90 transition-opacity" aria-label="Back">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </a>
        </div>
        <div class="px-4 pb-3">
          <h2 class="text-[#333] font-bold text-sm">Change Simplification</h2>
        </div>
        <nav class="px-3 space-y-1.5">
          @for (lesson of changeSimplificationLessons; track lesson.id; let i = $index) {
            <a href="#" class="flex items-center gap-3 rounded-xl p-2.5 transition-opacity hover:opacity-90"
               [style.background]="lesson.color">
              <span class="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </span>
              <span class="text-white text-xs font-medium flex-1 min-w-0">{{ lesson.title }}</span>
              <span class="text-white/90 text-xs font-medium shrink-0">{{ lesson.duration }}</span>
            </a>
          }
        </nav>
        <div class="px-4 pt-6 pb-3">
          <h2 class="text-[#333] font-bold text-xs uppercase tracking-wide">Practice Quiz</h2>
        </div>
        <nav class="px-3 space-y-1.5 flex-1 overflow-auto">
          @for (lesson of practiceQuizLessons; track lesson.id; let i = $index) {
            <a href="#" class="flex items-center gap-3 rounded-xl p-2.5 transition-opacity hover:opacity-90"
               [style.background]="lesson.color">
              <span class="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </span>
              <span class="text-white text-xs font-medium flex-1 min-w-0">{{ lesson.title }}</span>
              <span class="text-white/90 text-xs font-medium shrink-0">{{ lesson.duration }}</span>
            </a>
          }
        </nav>
      </aside>

      <!-- Right Main Content -->
      <main class="flex-1 min-w-0 flex flex-col">
        <!-- Teal header -->
       

        <div class="flex-1 p-8">
          <div class="max-w-4xl bg-white rounded-2xl shadow-sm p-8 min-h-[400px] flex flex-col">
            <h3 class="text-[#2BBCB0] font-bold text-lg mb-2">Create new event</h3>
            <p class="text-[#333] text-sm text-gray-500 mb-6 max-w-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
            <div class="flex-1"></div>
            <div class="flex justify-end pt-4">
              <button type="button" class="px-6 py-3 bg-[#2BBCB0] text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                Save Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
    styles: []
})
export class CourseFlowComponent {
    changeSimplificationLessons = [
        { id: 1, title: 'Lesson 01 : Introduction about XD', duration: '30 mins', color: LESSON_COLORS[0] },
        { id: 2, title: 'Lesson 02 : Workspace & Tools', duration: '30 mins', color: LESSON_COLORS[1] },
        { id: 3, title: 'Lesson 03 : Prototyping Basics', duration: '30 mins', color: LESSON_COLORS[2] },
        { id: 4, title: 'Lesson 04 : Sharing & Handoff', duration: '30 mins', color: LESSON_COLORS[3] },
    ];

    practiceQuizLessons = [
        { id: 5, title: 'Quiz 01 : Introduction', duration: '15 mins', color: LESSON_COLORS[0] },
        { id: 6, title: 'Quiz 02 : Workspace', duration: '15 mins', color: LESSON_COLORS[1] },
        { id: 7, title: 'Quiz 03 : Prototyping', duration: '15 mins', color: LESSON_COLORS[2] },
        { id: 8, title: 'Quiz 04 : Sharing', duration: '15 mins', color: LESSON_COLORS[3] },
        { id: 9, title: 'Quiz 05 : Advanced', duration: '20 mins', color: LESSON_COLORS[0] },
        { id: 10, title: 'Quiz 06 : Review', duration: '20 mins', color: LESSON_COLORS[1] },
        { id: 11, title: 'Quiz 07 : Final', duration: '25 mins', color: LESSON_COLORS[2] },
        { id: 12, title: 'Quiz 08 : Bonus', duration: '10 mins', color: LESSON_COLORS[3] },
        { id: 13, title: 'Quiz 09 : Extra', duration: '15 mins', color: LESSON_COLORS[0] },
        { id: 14, title: 'Quiz 10 : Summary', duration: '15 mins', color: LESSON_COLORS[1] },
    ];
}
