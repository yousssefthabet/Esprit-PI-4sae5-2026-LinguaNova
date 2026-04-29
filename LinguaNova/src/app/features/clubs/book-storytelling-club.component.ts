import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { STORY_BOOKS } from './book-storytelling.data';
import { ClubAiStudentPanelComponent } from '../../shared/components/club-ai-student-panel/club-ai-student-panel.component';

@Component({
  selector: 'app-book-storytelling-club',
  standalone: true,
  imports: [CommonModule, RouterLink, ClubAiStudentPanelComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#F7FBFA] via-[#F9FAFB] to-[#F5F7FA]">
      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pt-10 pb-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <a
            routerLink="/clubs"
            class="inline-flex items-center gap-2 text-[#2D6F6B] font-semibold hover:text-[#235855] transition-colors"
          >
            <span>Back to clubs</span>
          </a>
        </div>
      </section>

      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pb-16">
        <div class="rounded-3xl p-6 md:p-10 bg-white border border-[#E5ECEB] shadow-sm">
          <div class="max-w-3xl">
            <h1 class="text-3xl md:text-5xl font-black text-[#243447] leading-tight">Book & Storytelling Club</h1>
            <p class="mt-4 text-base md:text-lg text-[#4B5563] leading-relaxed">
              Choose a book, open the reader page, and let the AI narrator read it aloud while each word is highlighted in sync.
            </p>
          </div>
        </div>

        <app-club-ai-student-panel [clubId]="'book-storytelling'" />

        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          @for (book of books; track book.id) {
            <a
              [routerLink]="['/clubs/book-storytelling', book.id]"
              class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group"
            >
              <div class="h-52 overflow-hidden">
                <img [src]="book.cover" [alt]="book.title" class="w-full h-full object-cover">
              </div>

              <div class="p-5 flex-1 flex flex-col">
                <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2D6F6B]">
                  <span class="px-2 py-1 rounded-full bg-[#2D6F6B]/10">{{ book.level }}</span>
                  <span class="text-gray-500">{{ book.durationMin }} min read</span>
                </div>

                <h2 class="mt-4 text-xl font-extrabold text-[#243447] leading-snug">{{ book.title }}</h2>
                <p class="mt-1 text-sm text-gray-500">By {{ book.author }}</p>
                <p class="mt-4 text-gray-600 leading-relaxed flex-1">{{ book.summary }}</p>

                <span class="mt-6 inline-flex items-center gap-2 font-bold text-[#2D6F6B] transition-colors">
                  Start reading with AI
                  <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </div>
            </a>
          }
        </div>
      </section>
    </div>
  `
})
export class BookStorytellingClubComponent {
  readonly books = STORY_BOOKS;
}
