import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type ClubId = 'english-conversation' | 'book-storytelling' | 'drama-roleplay' | 'writing-grammar';

interface ClubCard {
  id: ClubId;
  title: string;
  description: string;
  image: string;
  actionLabel?: string;
  actionRoute?: string;
}

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50/50 min-h-screen">
      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pt-20 pb-16 text-center">
        <h1 class="text-5xl font-extrabold text-[#2D3748] mb-6 tracking-tight">Clubs</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Learning is more fun and effective when you practice with others. These clubs are static and designed for focused learning.
        </p>
        <p class="text-lg font-medium text-[#2D6F6B] uppercase tracking-wide">
          Explore our clubs and take your English learning journey to the next level
        </p>
      </section>

      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pb-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          @for (club of clubs; track club.id) {
            @if (club.actionRoute) {
              <a
                [routerLink]="club.actionRoute"
                class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-center sm:items-stretch group"
              >
                <div class="w-full sm:w-48 h-48 rounded-[16px] overflow-hidden flex-shrink-0 bg-gray-200">
                  <img [src]="club.image" class="w-full h-full object-cover" [alt]="club.title">
                </div>
                <div class="flex flex-col justify-center flex-1 text-center sm:text-left">
                  <h3 class="text-xl font-bold text-gray-900 mb-3">{{ club.title }}</h3>
                  <p class="text-gray-600 mb-6 leading-relaxed">{{ club.description }}</p>
                  <span class="inline-flex items-center gap-2 text-[#2D6F6B] font-bold transition-colors self-center sm:self-start">
                    {{ club.actionLabel }}
                    <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </span>
                </div>
              </a>
            } @else {
              <div class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-center sm:items-stretch">
                <div class="w-full sm:w-48 h-48 rounded-[16px] overflow-hidden flex-shrink-0 bg-gray-200">
                  <img [src]="club.image" class="w-full h-full object-cover" [alt]="club.title">
                </div>
                <div class="flex flex-col justify-center flex-1 text-center sm:text-left">
                  <h3 class="text-xl font-bold text-gray-900 mb-3">{{ club.title }}</h3>
                  <p class="text-gray-600 mb-6 leading-relaxed">{{ club.description }}</p>
                  <span class="inline-flex items-center text-gray-500 font-semibold self-center sm:self-start">Static club card</span>
                </div>
              </div>
            }
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ClubsComponent {
  readonly clubs: ClubCard[] = [
    {
      id: 'english-conversation',
      title: 'English Conversation Club',
      description: 'Practice speaking with peers in a supportive environment through interactive discussions and an AI conversation partner.',
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&auto=format&fit=crop',
      actionLabel: 'Open AI conversation club',
      actionRoute: '/clubs/english-conversation'
    },
    {
      id: 'book-storytelling',
      title: 'Book & Storytelling Club',
      description: 'Improve reading skills and vocabulary by exploring books, short stories, and creative storytelling activities.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
      actionLabel: 'Open Book & Storytelling club',
      actionRoute: '/clubs/book-storytelling'
    },
    {
      id: 'drama-roleplay',
      title: 'Drama & Roleplay Club',
      description: 'Build confidence and communication by acting out practical scenarios and roleplay exercises.',
      image: 'https://images.unsplash.com/photo-1533561089-13e551347012?q=80&w=400&auto=format&fit=crop',
      actionLabel: 'Open Drama & Roleplay club',
      actionRoute: '/clubs/drama-roleplay'
    },
    {
      id: 'writing-grammar',
      title: 'Writing & Grammar Club',
      description: 'Enhance writing quality with grammar guidance, sentence structure practice, and concise feedback loops.',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop',
      actionLabel: 'Open Writing & Grammar club',
      actionRoute: '/clubs/writing-grammar'
    }
  ];
}
