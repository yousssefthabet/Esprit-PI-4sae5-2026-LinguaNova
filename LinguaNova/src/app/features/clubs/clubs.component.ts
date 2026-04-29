import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BackendClub, ClubService } from '../../core/services/club.service';

interface ClubCard {
  id: string;
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
          Learning is more fun and effective when you practice with others. Explore active clubs and join collaborative language activities.
        </p>
        <p class="text-lg font-medium text-[#2D6F6B] uppercase tracking-wide">
          Explore our clubs and take your English learning journey to the next level
        </p>
      </section>

      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pb-24">
        @if (loading) {
          <div class="mb-6 text-sm font-semibold text-gray-500">Loading clubs...</div>
        }

        @if (error) {
          <div class="mb-6 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {{ error }}
          </div>
        }

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
                  <span class="inline-flex items-center text-gray-500 font-semibold self-center sm:self-start">Club card</span>
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
export class ClubsComponent implements OnInit {
  private readonly clubService = inject(ClubService);

  loading = true;
  error = '';
  clubs: ClubCard[] = [];

  ngOnInit(): void {
    this.clubService.getClubs().subscribe({
      next: (clubs) => {
        this.clubs = (clubs ?? [])
          .filter((club) => club.status === 'ACTIVE')
          .map((club) => this.toCard(club));
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load clubs right now.';
        this.loading = false;
      }
    });
  }

  private toCard(club: BackendClub): ClubCard {
    const actionRoute = this.resolveActionRoute(club);
    return {
      id: club.slug || String(club.id),
      title: club.title,
      description: club.description,
      image: club.image_url || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop',
      actionLabel: actionRoute ? (club.action_label || this.defaultActionLabel(club.slug, club.title)) : undefined,
      actionRoute
    };
  }

  private resolveActionRoute(club: BackendClub): string | undefined {
    const explicitRoute = (club.action_route || '').trim();
    if (explicitRoute) {
      return explicitRoute;
    }
    return this.defaultActionRoute((club.slug || '').trim());
  }

  private defaultActionRoute(slug: string): string | undefined {
    if (slug === 'english-conversation') return '/clubs/english-conversation';
    if (slug === 'book-storytelling') return '/clubs/book-storytelling';
    if (slug === 'drama-roleplay') return '/clubs/drama-roleplay';
    if (slug === 'writing-grammar') return '/clubs/writing-grammar';
    return undefined;
  }

  private defaultActionLabel(slug: string, title: string): string {
    if (slug === 'english-conversation') return 'Open AI conversation club';
    if (slug === 'book-storytelling') return 'Open Book & Storytelling club';
    if (slug === 'drama-roleplay') return 'Open Drama & Roleplay club';
    if (slug === 'writing-grammar') return 'Open Writing & Grammar club';
    return `Explore ${title}`;
  }
}
