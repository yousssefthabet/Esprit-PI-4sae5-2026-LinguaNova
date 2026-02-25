import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50/50 min-h-screen">
      <!-- Page Title Section -->
      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pt-20 pb-16 text-center">
        <h1 class="text-5xl font-extrabold text-[#2D3748] mb-6 tracking-tight">Clubs</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Learning is more fun and effective when you practice with others! Our clubs offer a dynamic way to improve your skills while connecting with fellow learners.
        </p>
        <p class="text-lg font-medium text-[#2D6F6B] uppercase tracking-wide">
          Explore our clubs and take your English learning journey to the next level 🚀
        </p>
      </section>

      <!-- Clubs Grid Section -->
      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pb-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Club Card 1 -->
          <div class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-center sm:items-stretch">
            <div class="w-full sm:w-48 h-48 rounded-[16px] overflow-hidden flex-shrink-0 bg-gray-200">
               <!-- Placeholder Image: Two people in conversation -->
               <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&auto=format&fit=crop" class="w-full h-full object-cover" alt="Conversation Club">
            </div>
            <div class="flex flex-col justify-center flex-1 text-center sm:text-left">
              <div class="flex items-center justify-center sm:justify-start gap-2 mb-3">
                 <span class="text-2xl">💬</span>
                 <h3 class="text-xl font-bold text-gray-900">English Conversation Club</h3>
              </div>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Practice speaking with peers in a fun and supportive environment through interactive discussions.
              </p>
              <button class="inline-flex items-center gap-2 text-[#2D6F6B] font-bold hover:text-[#235855] transition-colors self-center sm:self-start group">
                Learn more 
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

          <!-- Club Card 2 -->
          <div class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-center sm:items-stretch">
            <div class="w-full sm:w-48 h-48 rounded-[16px] overflow-hidden flex-shrink-0 bg-gray-200">
               <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop" class="w-full h-full object-cover" alt="Book Club">
            </div>
            <div class="flex flex-col justify-center flex-1 text-center sm:text-left">
              <div class="flex items-center justify-center sm:justify-start gap-2 mb-3">
                 <span class="text-2xl">📚</span>
                 <h3 class="text-xl font-bold text-gray-900">Book & Storytelling Club</h3>
              </div>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Improve reading skills and vocabulary by exploring books, short stories, and creative storytelling.
              </p>
              <button class="inline-flex items-center gap-2 text-[#2D6F6B] font-bold hover:text-[#235855] transition-colors self-center sm:self-start group">
                Learn more 
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

          <!-- Club Card 3 -->
          <div class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-center sm:items-stretch">
            <div class="w-full sm:w-48 h-48 rounded-[16px] overflow-hidden flex-shrink-0 bg-gray-200">
               <img src="https://images.unsplash.com/photo-1533561089-13e551347012?q=80&w=400&auto=format&fit=crop" class="w-full h-full object-cover" alt="Drama Club">
            </div>
            <div class="flex flex-col justify-center flex-1 text-center sm:text-left">
              <div class="flex items-center justify-center sm:justify-start gap-2 mb-3">
                 <span class="text-2xl">🎭</span>
                 <h3 class="text-xl font-bold text-gray-900">Drama & Roleplay Club</h3>
              </div>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Build confidence and communication by acting out real-life scenarios and fun roleplays.
              </p>
              <button class="inline-flex items-center gap-2 text-[#2D6F6B] font-bold hover:text-[#235855] transition-colors self-center sm:self-start group">
                Learn more 
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

          <!-- Club Card 4 -->
          <div class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-center sm:items-stretch">
            <div class="w-full sm:w-48 h-48 rounded-[16px] overflow-hidden flex-shrink-0 bg-gray-200">
               <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop" class="w-full h-full object-cover" alt="Writing Club">
            </div>
            <div class="flex flex-col justify-center flex-1 text-center sm:text-left">
              <div class="flex items-center justify-center sm:justify-start gap-2 mb-3">
                 <span class="text-2xl">🪶</span>
                 <h3 class="text-xl font-bold text-gray-900">Writing & Grammar Club</h3>
              </div>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Enhance your writing skills with engaging exercises, feedback, and grammar tips.
              </p>
              <button class="inline-flex items-center gap-2 text-[#2D6F6B] font-bold hover:text-[#235855] transition-colors self-center sm:self-start group">
                Learn more 
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-20 flex justify-center items-center gap-4">
          <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div class="flex items-center gap-2">
            <button class="w-10 h-10 rounded-xl bg-[#2D6F6B] text-white font-bold shadow-sm">1</button>
            <button class="w-10 h-10 rounded-xl bg-white text-gray-400 font-bold hover:bg-gray-50 border border-gray-100">2</button>
            <button class="w-10 h-10 rounded-xl bg-white text-gray-400 font-bold hover:bg-gray-50 border border-gray-100">3</button>
            <button class="w-10 h-10 rounded-xl bg-white text-gray-400 font-bold hover:bg-gray-50 border border-gray-100">4</button>
            <span class="text-gray-300 font-bold mx-1">...</span>
            <button class="w-10 h-10 rounded-xl bg-white text-gray-400 font-bold hover:bg-gray-50 border border-gray-100">7</button>
          </div>

          <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ClubsComponent { }
