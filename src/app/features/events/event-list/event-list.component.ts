import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EventDisplay {
  id: string;
  title: string;
  badge: 'Next event' | 'Past event';
  badgeColor: string;
  badgeTextColor: string;
  date: string;
  location: string;
  startTime: string;
  endTime: string;
  image: string;
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen py-16">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="mb-12">
          <h1 class="text-[36px] font-bold text-[#2C3E50] mb-4">Our Events</h1>
          <p class="text-[16px] text-gray-500 max-w-4xl leading-relaxed">
            Stay connected and inspired with our latest gatherings, workshops, and networking opportunities. Explore upcoming events and be part of a thriving community! 🚀
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-3 mb-10">
          <button 
            (click)="activeTab = 'all'"
            [class.bg-white]="activeTab === 'all'"
            [class.border-[#2D6F6B]]="activeTab === 'all'"
            [class.text-[#2D6F6B]]="activeTab === 'all'"
            [class.bg-[#F1F5F9]]="activeTab !== 'all'"
            [class.border-transparent]="activeTab !== 'all'"
            [class.text-gray-500]="activeTab !== 'all'"
            class="flex items-center gap-2 px-6 py-2 rounded-full border-2 font-semibold transition-all shadow-sm"
          >
            @if (activeTab === 'all') {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            }
            All
          </button>

          <button 
            (click)="activeTab = 'today'"
            [class.bg-white]="activeTab === 'today'"
            [class.border-[#2D6F6B]]="activeTab === 'today'"
            [class.text-[#2D6F6B]]="activeTab === 'today'"
            [class.bg-[#F1F5F9]]="activeTab !== 'today'"
            [class.border-transparent]="activeTab !== 'today'"
            [class.text-gray-500]="activeTab !== 'today'"
            class="px-6 py-2 rounded-full border-2 font-semibold transition-all shadow-sm"
          >
            Today
          </button>

          <button 
            (click)="activeTab = 'past'"
            [class.bg-white]="activeTab === 'past'"
            [class.border-[#2D6F6B]]="activeTab === 'past'"
            [class.text-[#2D6F6B]]="activeTab === 'past'"
            [class.bg-[#F1F5F9]]="activeTab !== 'past'"
            [class.border-transparent]="activeTab !== 'past'"
            [class.text-gray-500]="activeTab !== 'past'"
            class="px-6 py-2 rounded-full border-2 font-semibold transition-all shadow-sm"
          >
            Past event
          </button>

          <button 
            (click)="activeTab = 'next'"
            [class.bg-white]="activeTab === 'next'"
            [class.border-[#2D6F6B]]="activeTab === 'next'"
            [class.text-[#2D6F6B]]="activeTab === 'next'"
            [class.bg-[#F1F5F9]]="activeTab !== 'next'"
            [class.border-transparent]="activeTab !== 'next'"
            [class.text-gray-500]="activeTab !== 'next'"
            class="px-6 py-2 rounded-full border-2 font-semibold transition-all shadow-sm"
          >
            Next event
          </button>
        </div>

        <!-- Event Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          @for (event of filteredEvents; track event.id) {
            <div class="bg-white border border-gray-100 rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <!-- Image Section -->
              <div class="relative aspect-video">
                <img [src]="event.image" [alt]="event.title" class="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300">
                
                <!-- Status Badge -->
                <div 
                  [style.backgroundColor]="event.badgeColor"
                  [style.color]="event.badgeTextColor"
                  class="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                >
                  <div class="w-1.5 h-1.5 rounded-full" [style.backgroundColor]="event.badgeTextColor"></div>
                  {{ event.badge }}
                </div>

                <!-- Date Label -->
                <div class="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700 shadow-sm border border-gray-100">
                  {{ event.date }}
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-6">
                <h3 class="text-[18px] font-bold text-[#2C3E50] mb-4 line-clamp-2 leading-tight group-hover:text-[#2D6F6B] transition-colors">
                  {{ event.title }}
                </h3>
                
                <div class="space-y-2.5">
                  <div class="flex items-center gap-2 text-gray-500 text-sm">
                    <svg class="w-4 h-4 text-[#2D6F6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ event.location }}
                  </div>
                  
                  <div class="flex items-center gap-2 text-gray-500 text-sm">
                    <svg class="w-4 h-4 text-[#2D6F6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    from {{ event.startTime }} to {{ event.endTime }}
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination Section -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-10">
          <div class="flex items-center gap-2">
            <button class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            
            <button class="w-10 h-10 flex items-center justify-center bg-[#2D6F6B] text-white rounded-lg font-bold shadow-sm">1</button>
            <button class="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">2</button>
            <button class="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">3</button>
            <button class="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">4</button>
            <button class="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">5</button>
            <button class="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">6</button>
            <button class="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">7</button>

            <button class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div class="text-gray-400 text-sm font-medium">
            Page 1 of 16
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class EventListComponent implements OnInit {
  activeTab: 'all' | 'today' | 'past' | 'next' = 'all';

  events: EventDisplay[] = [
    {
      id: '1',
      title: 'Freelancer & Entrepreneur Networking Night',
      badge: 'Next event',
      badgeColor: '#E8F5F1',
      badgeTextColor: '#2D8B7D',
      date: '12 Jan. 2025',
      location: 'Technopole, Sousse, Tunisia',
      startTime: '11:00 am',
      endTime: '18:30 pm',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'Mastering Contracts Workshop and Publishing Industries',
      badge: 'Past event',
      badgeColor: '#FFE4E6',
      badgeTextColor: '#E11D48',
      date: '12 Jan. 2025',
      location: 'Technopole, Sousse, Tunisia',
      startTime: '11:00 am',
      endTime: '18:30 pm',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop'
    },
    {
      id: '3',
      title: 'Skill Up: Online Workshop Series',
      badge: 'Next event',
      badgeColor: '#E8F5F1',
      badgeTextColor: '#2D8B7D',
      date: '12 Jan. 2025',
      location: 'Technopole, Sousse, Tunisia',
      startTime: '11:00 am',
      endTime: '18:30 pm',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop'
    },
    {
      id: '4',
      title: 'English Conversation Café ☕',
      badge: 'Past event',
      badgeColor: '#FFE4E6',
      badgeTextColor: '#E11D48',
      date: '12 Jan. 2025',
      location: 'Technopole, Sousse, Tunisia',
      startTime: '11:00 am',
      endTime: '18:30 pm',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop'
    },
    {
      id: '5',
      title: 'Accent & Pronunciation Workshop 🎯',
      badge: 'Next event',
      badgeColor: '#E8F5F1',
      badgeTextColor: '#2D8B7D',
      date: '12 Jan. 2025',
      location: 'Technopole, Sousse, Tunisia',
      startTime: '11:00 am',
      endTime: '18:30 pm',
      image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop'
    },
    {
      id: '6',
      title: 'Enhance your professional communication skills in English. Lea...',
      badge: 'Next event',
      badgeColor: '#E8F5F1',
      badgeTextColor: '#2D8B7D',
      date: '12 Jan. 2025',
      location: 'Technopole, Sousse, Tunisia',
      startTime: '11:00 am',
      endTime: '18:30 pm',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop'
    }
  ];

  get filteredEvents(): EventDisplay[] {
    if (this.activeTab === 'all') return this.events;
    if (this.activeTab === 'past') return this.events.filter(e => e.badge === 'Past event');
    if (this.activeTab === 'next') return this.events.filter(e => e.badge === 'Next event');
    // 'today' is treated as empty for mock data purposes
    if (this.activeTab === 'today') return [];
    return this.events;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
