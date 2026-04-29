import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DRAMA_ROLEPLAY_SCENARIOS } from './drama-roleplay.data';
import { ClubAiStudentPanelComponent } from '../../shared/components/club-ai-student-panel/club-ai-student-panel.component';

@Component({
  selector: 'app-drama-roleplay-club',
  standalone: true,
  imports: [CommonModule, RouterLink, ClubAiStudentPanelComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#F8FBFB] via-[#F9FAFB] to-[#F5F7FA]">
      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pt-10 pb-8">
        <a
          routerLink="/clubs"
          class="inline-flex items-center gap-2 text-[#2D6F6B] font-semibold hover:text-[#235855] transition-colors"
        >
          <span>Back to clubs</span>
        </a>
      </section>

      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pb-16">
        <div class="rounded-3xl p-6 md:p-10 bg-white border border-[#E6ECEC] shadow-sm">
          <div class="max-w-3xl">
            <h1 class="text-3xl md:text-5xl font-black text-[#243447] leading-tight">Drama & Roleplay Club</h1>
            <p class="mt-4 text-base md:text-lg text-[#4B5563] leading-relaxed">
              Choose a scenario, pick your role, and enter a meet-style practice room. Invite classmates with a shared room link and rehearse in real time.
            </p>
          </div>
        </div>

        <app-club-ai-student-panel [clubId]="'drama-roleplay'" />

        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          @for (scenario of scenarios; track scenario.id) {
            <a
              [routerLink]="['/clubs/drama-roleplay', scenario.id]"
              class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group"
            >
              <div class="h-52 overflow-hidden">
                <img [src]="scenario.image" [alt]="scenario.title" class="w-full h-full object-cover">
              </div>

              <div class="p-5 flex-1 flex flex-col">
                <div class="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2D6F6B]">
                  <span class="px-2 py-1 rounded-full bg-[#2D6F6B]/10">{{ scenario.level }}</span>
                  <span class="text-gray-500">{{ scenario.durationMin }} min</span>
                </div>

                <h2 class="mt-4 text-xl font-extrabold text-[#243447] leading-snug">{{ scenario.title }}</h2>
                <p class="mt-2 text-sm text-gray-500">{{ scenario.setting }}</p>
                <p class="mt-4 text-gray-600 leading-relaxed flex-1">{{ scenario.summary }}</p>

                <div class="mt-4 flex flex-wrap gap-2">
                  @for (role of scenario.roles; track role.id) {
                    <span class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {{ role.name }}
                    </span>
                  }
                </div>

                <span class="mt-6 inline-flex items-center gap-2 font-bold text-[#2D6F6B] transition-colors">
                  Open roleplay setup
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
export class DramaRoleplayClubComponent {
  readonly scenarios = DRAMA_ROLEPLAY_SCENARIOS;
}
