import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BackendEvent, EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-meet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen py-10 font-sans">
      <div class="container mx-auto px-4 max-w-[1200px]">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div class="flex items-center gap-3">
            <button
              (click)="goBack()"
              class="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0D9488] hover:border-teal-100 transition-all shadow-sm"
              aria-label="Back"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-purple-100">Live meeting</span>
                <span class="text-gray-300">•</span>
                <span class="text-[11px] font-bold text-gray-400">Event #{{ eventId() }}</span>
              </div>
              <div class="text-2xl font-black text-gray-900 tracking-tight">{{ title() }}</div>
              <div class="text-[11px] font-bold text-gray-400 mt-1">
                @if (loading()) { Loading meeting… } @else { Join inside the app (if allowed). }
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="openExternally()"
              class="px-4 py-2 rounded-2xl border border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-50 transition-all"
              [disabled]="!meetingLink()"
            >
              Open in new tab
            </button>
          </div>
        </div>

        @if (errorMessage()) {
          <div class="mb-6 text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
            {{ errorMessage() }}
          </div>
        }

        <div class="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div class="text-sm font-bold text-gray-700">Meeting</div>
            <div class="text-[11px] font-bold text-gray-400 truncate max-w-[70%]">
              {{ meetingLink() }}
            </div>
          </div>

          <div class="p-0">
            @if (loading()) {
              <div class="p-10 text-gray-500 font-bold">Loading…</div>
            } @else if (!safeUrl()) {
              <div class="p-10 text-gray-500 font-bold">
                Meeting link is missing for this event.
              </div>
            } @else {
              <iframe
                class="w-full h-[75vh] bg-white"
                [src]="safeUrl()!"
                referrerpolicy="no-referrer"
                allow="camera; microphone; fullscreen; display-capture"
              ></iframe>

              <div class="p-6 border-t border-gray-100 bg-gray-50/30">
                <p class="text-[11px] font-bold text-gray-500">
                  If you see a blank frame, the meeting provider is blocking embedding (X-Frame-Options). Use “Open in new tab”.
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class EventMeetComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly eventId = computed(() => Number(this.route.snapshot.paramMap.get('id') ?? NaN));
  readonly loading = signal(true);
  readonly errorMessage = signal<string>('');
  readonly event = signal<BackendEvent | null>(null);

  readonly title = computed(() => this.event()?.event_title ?? 'Meeting');
  readonly meetingLink = computed(() => this.event()?.meeting_link?.trim() ?? '');

  readonly safeUrl = computed<SafeResourceUrl | null>(() => {
    let link = this.meetingLink();
    if (!link) return null;
    if (!/^https?:\/\//i.test(link)) link = `https://${link}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  });

  ngOnInit(): void {
    const id = this.eventId();
    if (!Number.isFinite(id)) {
      this.errorMessage.set('Invalid event id.');
      this.loading.set(false);
      return;
    }

    this.eventService.getBackendEventById(id).subscribe({
      next: (ev) => {
        this.event.set(ev);
        this.loading.set(false);
        if ((ev?.meeting_link ?? '').trim().length === 0) {
          this.errorMessage.set('Meeting link is missing for this event.');
        }
      },
      error: () => {
        this.errorMessage.set('Failed to load event meeting link.');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/student/events']);
  }

  openExternally(): void {
    let link = this.meetingLink();
    if (!link) return;
    if (!/^https?:\/\//i.test(link)) link = `https://${link}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}

