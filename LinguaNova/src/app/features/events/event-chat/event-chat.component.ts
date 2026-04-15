import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  createdAt: Date;
  reactions?: Record<string, number>;
};

@Component({
  selector: 'app-event-chat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen py-10 font-sans">
      <div class="container mx-auto px-4 max-w-[980px]">
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
                <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Event chat</span>
                <span class="text-gray-300">•</span>
                <span class="text-[11px] font-bold text-gray-400">Event #{{ eventId() }}</span>
              </div>
              <div class="text-2xl font-black text-gray-900 tracking-tight">Group discussion</div>
              <div class="text-[11px] font-bold text-gray-400 mt-1">
                @if (connecting()) {
                  Connecting…
                } @else if (connectionError()) {
                  {{ connectionError() }}
                } @else {
                  Connected as <span class="text-gray-600">{{ me() }}</span>
                }
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="px-4 py-2 rounded-2xl border border-gray-100 bg-white shadow-sm text-[11px] font-bold text-gray-500">
              <span class="inline-flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full"
                  [class]="connecting() ? 'bg-amber-400' : (connectionError() ? 'bg-red-400' : 'bg-emerald-400')"
                ></span>
                @if (connecting()) { Connecting } @else if (connectionError()) { Offline } @else { Live }
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-white via-white to-teal-50/30">
            <div class="flex items-center justify-between gap-4">
              <div class="text-sm font-bold text-gray-700">Chat</div>
              <button
                type="button"
                (click)="scrollToBottom()"
                class="text-[11px] font-black uppercase tracking-widest text-[#0D9488] hover:underline"
              >
                Jump to latest
              </button>
            </div>
          </div>

          <div #messagesContainer class="p-6 space-y-4 max-h-[58vh] overflow-auto bg-[radial-gradient(circle_at_top,rgba(13,148,136,0.06),transparent_40%)]">
            @if (messages().length === 0) {
              <div class="rounded-3xl border border-dashed border-gray-200 bg-white/60 p-10 text-center">
                <div class="text-sm font-black text-gray-900">No messages yet</div>
                <div class="text-[11px] font-bold text-gray-400 mt-1">Be the first to say hi to the group.</div>
              </div>
            } @else {
              @for (m of messages(); track m.id) {
                <div class="flex items-end gap-3" [class.justify-end]="m.sender === me()">
                  @if (m.sender !== me()) {
                    <div class="w-9 h-9 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 font-black text-xs shrink-0">
                      {{ initials(m.sender) }}
                    </div>
                  }

                  <div class="max-w-[82%]">
                    <div class="flex items-center gap-2 mb-1" [class.justify-end]="m.sender === me()">
                      <span class="text-[10px] font-black uppercase tracking-widest text-gray-400" [class.hidden]="m.sender === me()">
                        {{ m.sender }}
                      </span>
                      <span class="text-[10px] font-black uppercase tracking-widest text-gray-300">•</span>
                      <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {{ m.createdAt | date:'shortTime' }}
                      </span>
                    </div>

                    <div
                      class="rounded-[22px] px-5 py-4 border shadow-sm"
                      [class]="m.sender === me()
                        ? 'bg-[#0D9488] border-teal-700 text-white shadow-teal-100/60'
                        : 'bg-white border-gray-100 text-gray-800'"
                    >
                      <div class="text-sm font-medium whitespace-pre-wrap leading-relaxed">{{ m.text }}</div>

                      <div class="mt-3 flex flex-wrap items-center gap-2" [class.justify-end]="m.sender === me()">
                        @for (emoji of ['👍','❤️','😂','🔥']; track emoji) {
                          <button
                            type="button"
                            (click)="react(m.id, emoji)"
                            class="px-3 py-1.5 rounded-full border text-xs font-black transition-all"
                            [class]="m.sender === me()
                              ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'"
                          >
                            {{ emoji }}
                            <span class="opacity-60">·</span>
                            {{ (m.reactions?.[emoji] ?? 0) }}
                          </button>
                        }
                      </div>
                    </div>
                  </div>

                  @if (m.sender === me()) {
                    <div class="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-black text-xs shrink-0">
                      {{ initials(me()) }}
                    </div>
                  }
                </div>
              }
            }
          </div>

          <div class="p-5 border-t border-gray-100 bg-white">
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <div class="flex-1 relative">
                <input
                  class="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all outline-none text-gray-800 placeholder:text-gray-300 shadow-sm pr-28"
                  placeholder="Write a message…"
                  [value]="draft()"
                  (input)="draft.set(($any($event.target).value ?? '').toString())"
                  (keydown.enter)="send()"
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                  Enter
                </div>
              </div>

              <button
                type="button"
                (click)="send()"
                class="px-6 py-4 rounded-2xl bg-[#0D9488] text-white font-black shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                [disabled]="!draft().trim().length || connecting() || !!connectionError()"
              >
                Send
              </button>
            </div>

            @if (connectionError()) {
              <div class="mt-3 text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                {{ connectionError() }}
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
export class EventChatComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  readonly eventId = computed(() => Number(this.route.snapshot.paramMap.get('id') ?? NaN));
  readonly me = computed(() => {
    const u = this.authService.currentUserValue;
    const fullName = `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim();
    return (fullName || u?.email || 'Me').toString();
  });

  readonly messages = signal<ChatMessage[]>([]);
  readonly draft = signal('');
  readonly connecting = signal(true);
  readonly connectionError = signal<string | null>(null);

  private stomp?: Client;

  @ViewChild('messagesContainer') private readonly messagesContainer?: ElementRef<HTMLDivElement>;

  goBack(): void {
    this.router.navigate(['/dashboard/student/events']);
  }

  ngOnInit(): void {
    const eventId = this.eventId();
    if (!Number.isFinite(eventId)) {
      this.connectionError.set('Invalid event id.');
      this.connecting.set(false);
      return;
    }

    // Use relative API path; apiInterceptor prefixes BASE_URL (/api) automatically.
    this.http.get<any[]>(`/events/${eventId}/chat`).subscribe({
      next: (arr) => {
        const mapped = (arr ?? []).map((m) => ({
          id: String(m.id),
          sender: String(m.senderName ?? m.sender ?? 'Unknown'),
          text: String(m.text ?? ''),
          createdAt: new Date(m.createdAt ?? Date.now()),
          reactions: (m.reactions ?? {}) as Record<string, number>,
        })) as ChatMessage[];
        this.messages.set(mapped);
        queueMicrotask(() => this.scrollToBottom());
      },
      error: () => {
        // ignore history errors; realtime still works
      },
    });

    const socket = new SockJS('/ws');
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 1500,
      onConnect: () => {
        this.connecting.set(false);
        this.connectionError.set(null);

        client.subscribe(`/topic/events/${eventId}/chat`, (msg: IMessage) => {
          const m = JSON.parse(msg.body ?? '{}');
          const mapped: ChatMessage = {
            id: String(m.id),
            sender: String(m.senderName ?? m.sender ?? 'Unknown'),
            text: String(m.text ?? ''),
            createdAt: new Date(m.createdAt ?? Date.now()),
            reactions: (m.reactions ?? {}) as Record<string, number>,
          };
          this.messages.update((arr) => [...arr, mapped]);
          queueMicrotask(() => this.scrollToBottom());
        });

        client.subscribe(`/topic/events/${eventId}/chat.reactions`, (msg: IMessage) => {
          const m = JSON.parse(msg.body ?? '{}');
          const id = String(m.id);
          const reactions = (m.reactions ?? {}) as Record<string, number>;
          this.messages.update((arr) =>
            arr.map((x) => (x.id === id ? { ...x, reactions } : x))
          );
        });
      },
      onStompError: () => {
        this.connectionError.set('Chat connection error.');
        this.connecting.set(false);
      },
      onWebSocketError: () => {
        this.connectionError.set('Cannot connect to chat server.');
        this.connecting.set(false);
      },
    });

    this.stomp = client;
    client.activate();
  }

  ngOnDestroy(): void {
    this.stomp?.deactivate();
  }

  send(): void {
    const text = this.draft().trim();
    if (!text.length) return;
    const eventId = this.eventId();
    const studentIdRaw = this.authService.currentUserValue?.id;
    const studentId = studentIdRaw ? Number(studentIdRaw) : NaN;
    if (!Number.isFinite(eventId) || !Number.isFinite(studentId)) return;

    this.stomp?.publish({
      destination: `/app/events/${eventId}/chat.send`,
      body: JSON.stringify({
        student_id: studentId,
        sender_name: this.me(),
        text,
      }),
    });
    this.draft.set('');
  }

  react(messageId: string, emoji: string): void {
    const eventId = this.eventId();
    if (!Number.isFinite(eventId)) return;
    this.stomp?.publish({
      destination: `/app/events/${eventId}/chat.react`,
      body: JSON.stringify({
        eventId,
        messageId,
        emoji,
      }),
    });
  }

  scrollToBottom(): void {
    const el = this.messagesContainer?.nativeElement;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }

  initials(name: string): string {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? 'U';
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (a + b).toUpperCase();
  }
}

