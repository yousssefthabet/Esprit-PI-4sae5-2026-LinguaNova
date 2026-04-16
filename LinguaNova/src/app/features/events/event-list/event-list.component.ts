import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendEvent, EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import * as L from 'leaflet';

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
  raw: BackendEvent;
}

function toPrettyDate(iso: string): string {
  // iso: yyyy-MM-dd
  try {
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function toAmPm(time: string): string {
  // time: HH:mm or HH:mm:ss
  const hh = Number(time?.slice(0, 2));
  const mm = time?.slice(3, 5) ?? '00';
  if (!Number.isFinite(hh)) return time;
  const suffix = hh >= 12 ? 'pm' : 'am';
  const hour12 = ((hh + 11) % 12) + 1;
  return `${hour12}:${mm} ${suffix}`;
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

        @if (errorMessage) {
          <div class="mb-6 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {{ errorMessage }}
          </div>
        }

        @if (loading) {
          <div class="text-gray-500 font-semibold">Loading events...</div>
        }

        <!-- Event Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          @for (event of filteredEvents; track event.id) {
            <div (click)="onEventCardClick(event)" class="bg-white border border-gray-100 rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
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

        @if (selectedEvent) {
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" (click)="closeModal()">
            <div class="bg-white w-full max-w-2xl rounded-[24px] overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col" (click)="$event.stopPropagation()">
              <div class="relative">
                <img [src]="selectedEvent.image" [alt]="selectedEvent.title" class="w-full h-[220px] object-cover" />
                <button (click)="closeModal()" class="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 hover:bg-white border border-gray-100 flex items-center justify-center text-gray-500 transition-all shadow-sm">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div class="p-6 md:p-8 overflow-y-auto">
                <div class="flex flex-wrap items-center gap-3 mb-4">
                  <span class="px-3 py-1 rounded-full text-xs font-bold"
                    [style.backgroundColor]="selectedEvent.badgeColor"
                    [style.color]="selectedEvent.badgeTextColor"
                  >
                    {{ selectedEvent.badge }}
                  </span>
                  <span class="text-xs font-bold text-gray-400">{{ selectedEvent.raw.category }}</span>
                  <span class="text-gray-300">•</span>
                  <span class="text-xs font-bold text-gray-400">{{ selectedEvent.raw.event_type }}</span>
                  @if (selectedEvent.raw.max_attendees) {
                    <span class="text-gray-300">•</span>
                    <span class="text-xs font-bold text-gray-400">Max: {{ selectedEvent.raw.max_attendees }}</span>
                  }
                </div>

                <h2 class="text-2xl font-black text-gray-900 mb-2">{{ selectedEvent.title }}</h2>
                <p class="text-gray-600 text-sm leading-relaxed mb-6">{{ selectedEvent.raw.session_description }}</p>

                @if (joinBanner) {
                  <div class="mb-5 text-[12px] font-semibold rounded-xl px-4 py-3 border"
                    [class]="joinBanner.type === 'success'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                      : 'text-red-700 bg-red-50 border-red-100'"
                  >
                    {{ joinBanner.text }}
                  </div>
                }

                <div class="grid md:grid-cols-2 gap-4 mb-6">
                  <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                    <p class="text-sm font-bold text-gray-700">{{ selectedEvent.date }}</p>
                  </div>
                  <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
                    <p class="text-sm font-bold text-gray-700">{{ selectedEvent.startTime }} → {{ selectedEvent.endTime }}</p>
                  </div>
                </div>

                @if (selectedEvent.raw.event_type === 'REAL_LIFE') {
                  <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 mb-4">
                    <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Location</p>
                    <p class="text-sm font-bold text-emerald-900">{{ selectedEvent.raw.location_name ?? 'On site' }}</p>
                    @if (selectedEvent.raw.latitude != null && selectedEvent.raw.longitude != null) {
                      <p class="text-[11px] font-bold text-emerald-700 mt-1">{{ selectedEvent.raw.latitude }}, {{ selectedEvent.raw.longitude }}</p>
                    }
                    @if (distanceKmByEventId[selectedEvent.id] != null) {
                      <p class="text-[11px] font-bold text-emerald-800 mt-2">Distance: {{ distanceKmByEventId[selectedEvent.id] }} km</p>
                    }
                  </div>

                  <div class="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4">
                    <div class="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Map</p>
                      <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest">You ↔ Event</p>
                    </div>
                    <div #distanceMap class="w-full h-[260px] bg-gray-50"></div>
                    <div class="px-4 py-3 bg-white border-t border-gray-100 text-[11px] font-bold text-gray-500">
                      If you don’t see your location, allow browser GPS permission.
                    </div>
                  </div>
                }

                @if (selectedEvent.raw.event_type === 'LIVE_MEETING') {
                  <div class="p-4 rounded-2xl bg-purple-50 border border-purple-100 mb-4">
                    <p class="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-1">Virtual classroom</p>
                    <p class="text-sm font-bold text-purple-900 break-all">{{ selectedEvent.raw.meeting_link ?? '—' }}</p>
                  </div>
                }

                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                  @if (authService.currentUserValue?.role === UserRole.STUDENT) {
                    <button
                      type="button"
                      (click)="joinEvent(selectedEvent, $event)"
                      class="flex-1 py-3 rounded-2xl bg-[#2D6F6B] text-white font-bold hover:opacity-90 transition-all disabled:opacity-60"
                      [disabled]="joiningId === selectedEvent.id"
                    >
                      @if (joiningId === selectedEvent.id) { Joining... } @else { Join event }
                    </button>
                  }
                  <button type="button" (click)="closeModal()" class="flex-1 py-3 rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Pagination Section -->
        <div class="flex flex-col items-center gap-4 border-t border-gray-100 pt-10">
          <div class="flex items-center justify-center gap-2 flex-wrap">
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

          <div class="text-gray-400 text-sm font-medium text-center">
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
  private readonly eventService = inject(EventService);
  readonly authService = inject(AuthService);

  activeTab: 'all' | 'today' | 'past' | 'next' = 'all';
  loading = true;
  errorMessage = '';

  events: EventDisplay[] = [];
  distanceKmByEventId: Record<string, number> = {};
  joiningId: string | null = null;
  selectedEvent: EventDisplay | null = null;
  joinBanner: { type: 'success' | 'error'; text: string } | null = null;

  protected readonly UserRole = UserRole;

  @ViewChild('distanceMap') private readonly distanceMap?: ElementRef<HTMLDivElement>;
  private map?: L.Map;
  private eventMarker?: L.CircleMarker;
  private userMarker?: L.CircleMarker;
  private line?: L.Polyline;

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
    this.loadEvents();
  }

  private get isStudent(): boolean {
    return this.authService.currentUserValue?.role === UserRole.STUDENT;
  }

  onEventCardClick(event: EventDisplay): void {
    this.selectedEvent = event;
    console.log('Event details:', event.raw);

    if (!this.isStudent) return;
    if (event.raw.event_type !== 'REAL_LIFE') return;
    if (event.raw.latitude == null || event.raw.longitude == null) return;

    this.computeDistanceToEvent(event.id, event.raw.latitude, event.raw.longitude);
    setTimeout(() => this.initDistanceMapIfNeeded(), 0);
  }

  closeModal(): void {
    this.selectedEvent = null;
    this.joinBanner = null;
    this.destroyMap();
  }

  joinEvent(event: EventDisplay, domEvent: Event): void {
    domEvent.stopPropagation();
    this.joinBanner = null;
    const studentIdRaw = this.authService.currentUserValue?.id;
    const studentId = studentIdRaw ? Number(studentIdRaw) : NaN;
    if (!Number.isFinite(studentId)) {
      this.joinBanner = { type: 'error', text: 'Cannot determine student id. Please login again.' };
      return;
    }
    this.joiningId = event.id;
    this.eventService.registerForEvent(event.id, studentId).subscribe({
      next: (res) => {
        this.joiningId = null;
        this.joinBanner = { type: 'success', text: 'Joined successfully.' };
      },
      error: (err) => {
        this.joiningId = null;
        if (err?.status === 409) {
          this.joinBanner = { type: 'success', text: 'You already joined this event.' };
          return;
        }
        this.joinBanner = { type: 'error', text: 'Join failed. Please try again.' };
      }
    });
  }

  private computeDistanceToEvent(eventId: string, lat: number, lng: number): void {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = this.haversineKm(pos.coords.latitude, pos.coords.longitude, lat, lng);
        this.distanceKmByEventId = { ...this.distanceKmByEventId, [eventId]: d };
        console.log(`Distance to event ${eventId}:`, d, 'km');
        this.updateMapUserLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.log('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  }

  private initDistanceMapIfNeeded(): void {
    const ev = this.selectedEvent?.raw;
    if (!ev) return;
    if (ev.event_type !== 'REAL_LIFE') return;
    if (ev.latitude == null || ev.longitude == null) return;
    if (!this.distanceMap?.nativeElement) return;

    // Recreate map each time modal opens to avoid Leaflet container reuse issues.
    this.destroyMap();

    const el = this.distanceMap.nativeElement;
    this.map = L.map(el, { zoomControl: true }).setView([ev.latitude, ev.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.eventMarker = L.circleMarker([ev.latitude, ev.longitude], {
      radius: 9,
      color: '#059669',
      weight: 3,
      fillColor: '#10B981',
      fillOpacity: 0.25
    }).addTo(this.map);

    // Fit to event only for now; user marker will update when geolocation returns.
    this.map.setView([ev.latitude, ev.longitude], 13);
    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  private updateMapUserLocation(lat: number, lng: number): void {
    const ev = this.selectedEvent?.raw;
    if (!this.map || !ev || ev.latitude == null || ev.longitude == null) return;

    if (!this.userMarker) {
      this.userMarker = L.circleMarker([lat, lng], {
        radius: 9,
        color: '#2563EB',
        weight: 3,
        fillColor: '#3B82F6',
        fillOpacity: 0.25
      }).addTo(this.map);
    } else {
      this.userMarker.setLatLng([lat, lng]);
    }

    const eventLatLng: L.LatLngExpression = [ev.latitude, ev.longitude];
    const userLatLng: L.LatLngExpression = [lat, lng];
    if (!this.line) {
      this.line = L.polyline([userLatLng, eventLatLng], { color: '#0D9488', weight: 4, opacity: 0.7 }).addTo(this.map);
    } else {
      this.line.setLatLngs([userLatLng, eventLatLng]);
    }

    const bounds = L.latLngBounds([eventLatLng as any, userLatLng as any]);
    this.map.fitBounds(bounds.pad(0.25));
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
    }
    this.map = undefined;
    this.eventMarker = undefined;
    this.userMarker = undefined;
    this.line = undefined;
  }

  private loadEvents(): void {
    this.loading = true;
    this.errorMessage = '';
    this.eventService.getAllBackendEvents().subscribe({
      next: (events) => {
        const now = new Date();
        this.events = (events ?? []).map((e: BackendEvent): EventDisplay => {
          const date = e.event_date ?? '';
          const start = e.start_at ?? '';
          const end = e.ends_at ?? '';
          const dateObj = date ? new Date(`${date}T00:00:00`) : null;
          const isPast = dateObj ? dateObj.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() : false;

          return {
            id: String(e.id),
            title: e.event_title,
            badge: isPast ? 'Past event' : 'Next event',
            badgeColor: isPast ? '#FFE4E6' : '#E8F5F1',
            badgeTextColor: isPast ? '#E11D48' : '#2D8B7D',
            date: toPrettyDate(date),
            location: e.event_type === 'REAL_LIFE'
              ? (e.location_name ?? 'On site')
              : 'Online',
            startTime: toAmPm(start),
            endTime: toAmPm(end),
            image: (e.image_url && e.image_url.trim().length > 0)
              ? e.image_url
              : 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop',
            raw: e
          };
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load events';
      }
    });
  }
}
