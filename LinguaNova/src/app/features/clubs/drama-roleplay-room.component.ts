import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { RoleplayScenario, getDramaScenarioById } from './drama-roleplay.data';

interface RoleplayMessage {
  id: string;
  role: 'student' | 'ai';
  text: string;
  createdAt: Date;
}

@Component({
  selector: 'app-drama-roleplay-room',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#F5FBFA] via-[#F9FAFB] to-white">
      <section class="max-w-[1300px] mx-auto px-4 md:px-8 pt-10 pb-8">
        <a
          routerLink="/clubs/drama-roleplay"
          class="inline-flex items-center gap-2 text-[#2D6F6B] font-semibold hover:text-[#235855] transition-colors"
        >
          <span>Back to scenarios</span>
        </a>
      </section>

      @if (scenario()) {
        <section class="max-w-[1300px] mx-auto px-4 md:px-8 pb-14">
          <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
            <aside class="space-y-6">
              <div class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-5">
                <img [src]="scenario()!.image" [alt]="scenario()!.title" class="w-full h-44 rounded-2xl object-cover">
                <h1 class="mt-4 text-2xl font-black text-[#243447] leading-tight">{{ scenario()!.title }}</h1>
                <p class="text-sm text-gray-500 mt-1">{{ scenario()!.setting }} • {{ scenario()!.durationMin }} min</p>
                <p class="mt-3 text-gray-600 leading-relaxed">{{ scenario()!.summary }}</p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span class="px-2 py-1 rounded-full text-xs font-semibold bg-[#2D6F6B]/10 text-[#2D6F6B]">
                    {{ scenario()!.level }}
                  </span>
                  <span class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {{ scenario()!.roles.length }} roles
                  </span>
                </div>
              </div>

              <div class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-5">
                <h2 class="text-lg font-extrabold text-[#243447]">Room setup</h2>
                <p class="text-sm text-gray-600 mt-1">Choose your role, then enter the room. Share the link so classmates join the same scenario.</p>

                <div class="mt-4">
                  <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">Room code</label>
                  <input
                    type="text"
                    [ngModel]="roomCode()"
                    (ngModelChange)="onRoomCodeChange($event)"
                    maxlength="10"
                    class="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 font-semibold tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-[#2D6F6B]/30"
                    placeholder="ROOM01"
                  >
                </div>

                <div class="mt-4">
                  <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">Choose your role</label>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (role of scenario()!.roles; track role.id) {
                      <button
                        type="button"
                        (click)="selectRole(role.id)"
                        class="px-3 py-2 rounded-xl border text-sm font-semibold transition-colors"
                        [class.border-[#2D6F6B]]="selectedRoleId() === role.id"
                        [class.bg-[#2D6F6B]/10]="selectedRoleId() === role.id"
                        [class.text-[#1F5956]]="selectedRoleId() === role.id"
                        [class.border-gray-200]="selectedRoleId() !== role.id"
                        [class.text-gray-700]="selectedRoleId() !== role.id"
                      >
                        {{ role.name }}
                      </button>
                    }
                  </div>
                </div>

                @if (selectedRole()) {
                  <div class="mt-4 rounded-2xl border border-[#DDE9E8] bg-[#F7FBFA] p-3">
                    <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Role objective</p>
                    <p class="text-sm text-[#314155] mt-1">{{ selectedRole()!.objective }}</p>
                  </div>
                }

                <div class="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    (click)="enterRoom()"
                    [disabled]="!canJoin()"
                    class="h-11 px-5 rounded-xl bg-[#2D6F6B] text-white font-bold hover:bg-[#235855] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enter roleplay room
                  </button>
                  @if (isJoined()) {
                    <button
                      type="button"
                      (click)="leaveRoom()"
                      class="h-11 px-5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                    >
                      Leave room
                    </button>
                  }
                </div>

                <div class="mt-5">
                  <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">Share this room</label>
                  <div class="mt-1 flex gap-2">
                    <input
                      [value]="shareLink()"
                      readonly
                      class="h-11 flex-1 rounded-xl border border-gray-200 px-3 text-sm text-gray-600 bg-gray-50"
                    >
                    <button
                      type="button"
                      (click)="copyShareLink()"
                      class="h-11 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  @if (copyStatus()) {
                    <p class="mt-2 text-xs font-semibold text-[#2D6F6B]">{{ copyStatus() }}</p>
                  }
                </div>
              </div>
            </aside>

            <div class="space-y-6">
              @if (!isJoined()) {
                <div class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-6 md:p-8">
                  <h2 class="text-2xl font-black text-[#243447]">Meet-style roleplay room</h2>
                  <p class="mt-3 text-gray-600 leading-relaxed">
                    Once you enter, students can join the same room link and act the scenario together with camera and microphone support.
                  </p>

                  <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    @for (goal of scenario()!.goals; track goal) {
                      <div class="rounded-2xl border border-[#DDE9E8] bg-[#F8FCFB] px-4 py-3 text-sm font-semibold text-[#2E4256]">
                        {{ goal }}
                      </div>
                    }
                  </div>

                  <div class="mt-6 rounded-2xl border border-[#E4E8EE] bg-[#F8FAFD] p-4">
                    <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">AI coach style</p>
                    <p class="text-sm text-[#314155] mt-1">{{ scenario()!.aiCoachStyle }}</p>
                  </div>
                </div>
              } @else {
                <div class="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-6">
                  <div class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm overflow-hidden">
                    <div class="px-4 md:px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
                      <div>
                        <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Live room</p>
                        <h3 class="text-lg font-black text-[#243447]">
                          {{ scenario()!.title }} • {{ selectedRole()?.name }}
                        </h3>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <button
                          type="button"
                          (click)="copyShareLink()"
                          class="h-10 px-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Copy invite
                        </button>
                        <button
                          type="button"
                          (click)="openMeetInNewTab()"
                          class="h-10 px-3 rounded-lg bg-[#243447] text-white text-sm font-semibold hover:bg-[#1B2938] transition-colors"
                        >
                          Open in new tab
                        </button>
                      </div>
                    </div>

                    @if (safeMeetUrl()) {
                      <iframe
                        class="w-full h-[560px] bg-white"
                        [src]="safeMeetUrl()!"
                        referrerpolicy="no-referrer"
                        allow="camera; microphone; fullscreen; display-capture"
                      ></iframe>
                    } @else {
                      <div class="p-8 text-gray-500 font-semibold">Meeting URL is not available.</div>
                    }

                    <div class="px-4 md:px-6 py-3 bg-gray-50 border-t border-gray-100">
                      <p class="text-xs text-gray-500">
                        If your browser blocks the embed, use "Open in new tab" and continue the same room.
                      </p>
                    </div>
                  </div>

                  <div class="space-y-6">
                    <div class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-5">
                      <h3 class="text-lg font-black text-[#243447]">Your role instructions</h3>
                      <p class="text-sm text-gray-600 mt-1">{{ selectedRole()?.objective }}</p>

                      <div class="mt-4 space-y-2">
                        @for (tip of selectedRole()?.speakingTips ?? []; track tip) {
                          <div class="rounded-xl bg-[#F8FCFB] border border-[#DDE9E8] px-3 py-2 text-sm text-[#314155]">
                            {{ tip }}
                          </div>
                        }
                      </div>

                      <div class="mt-4">
                        <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Suggested opening lines</p>
                        <div class="mt-2 flex flex-wrap gap-2">
                          @for (line of scenario()!.openingLines; track line) {
                            <button
                              type="button"
                              (click)="usePrompt(line)"
                              class="px-3 py-2 text-xs rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              {{ line }}
                            </button>
                          }
                        </div>
                      </div>
                    </div>

                    <div class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-5">
                      <h3 class="text-lg font-black text-[#243447]">AI Role Coach</h3>
                      <p class="text-sm text-gray-600 mt-1">Chat with the AI coach for realistic line suggestions and feedback.</p>

                      <div class="mt-4 h-64 overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50 p-3">
                        @for (message of chatMessages(); track message.id) {
                          <div class="mb-3 flex" [class.justify-end]="message.role === 'student'" [class.justify-start]="message.role === 'ai'">
                            <div
                              class="max-w-[90%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                              [class.bg-[#2D6F6B]]="message.role === 'student'"
                              [class.text-white]="message.role === 'student'"
                              [class.bg-white]="message.role === 'ai'"
                              [class.text-[#2C3E50]]="message.role === 'ai'"
                              [class.border]="message.role === 'ai'"
                              [class.border-gray-100]="message.role === 'ai'"
                            >
                              {{ message.text }}
                            </div>
                          </div>
                        }
                        @if (aiTyping()) {
                          <div class="text-sm text-gray-500">AI coach is typing...</div>
                        }
                      </div>

                      <div class="mt-3 flex gap-2">
                        <input
                          type="text"
                          [(ngModel)]="draftMessage"
                          (keydown.enter)="sendMessage()"
                          placeholder="Ask for a line, correction, or feedback..."
                          class="h-11 flex-1 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6F6B]/30"
                        >
                        <button
                          type="button"
                          (click)="sendMessage()"
                          [disabled]="!draftMessage.trim() || aiTyping()"
                          class="h-11 px-4 rounded-xl bg-[#2D6F6B] text-white text-sm font-bold hover:bg-[#235855] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </section>
      }
    </div>
  `
})
export class DramaRoleplayRoomComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly subscriptions = new Subscription();

  private messageCounter = 0;
  private copyStatusTimer: ReturnType<typeof setTimeout> | null = null;
  private currentScenarioId = '';

  readonly scenario = signal<RoleplayScenario | null>(null);
  readonly selectedRoleId = signal('');
  readonly roomCode = signal('');
  readonly isJoined = signal(false);
  readonly copyStatus = signal('');
  readonly aiTyping = signal(false);
  readonly chatMessages = signal<RoleplayMessage[]>([]);

  readonly selectedRole = computed(() => this.scenario()?.roles.find((role) => role.id === this.selectedRoleId()) ?? null);
  readonly canJoin = computed(() => !!this.selectedRole() && this.roomCode().length >= 4);

  readonly meetRoomName = computed(() => {
    const currentScenario = this.scenario();
    if (!currentScenario) return '';
    const room = this.roomCode();
    if (!room) return '';
    return `LinguaNova-${currentScenario.id}-${room}`.replace(/[^A-Za-z0-9-]/g, '-').replace(/-+/g, '-');
  });

  readonly meetUrl = computed(() => {
    const room = this.meetRoomName();
    return room ? `https://meet.jit.si/${room}` : '';
  });

  readonly safeMeetUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.meetUrl();
    if (!url) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  readonly shareLink = computed(() => {
    const currentScenario = this.scenario();
    if (!currentScenario) return '';

    const params = new URLSearchParams();
    params.set('room', this.roomCode());

    const path = `/clubs/drama-roleplay/${currentScenario.id}?${params.toString()}`;
    if (!this.isBrowser) return path;
    return `${window.location.origin}${path}`;
  });

  draftMessage = '';
  readonly displayName = this.getPreferredName();

  constructor() {
    this.subscriptions.add(
      combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, query]) => {
        const scenarioId = params.get('scenarioId') ?? '';
        const currentScenario = getDramaScenarioById(scenarioId);

        if (!currentScenario) {
          this.router.navigate(['/clubs/drama-roleplay']);
          return;
        }

        if (this.currentScenarioId !== currentScenario.id) {
          this.currentScenarioId = currentScenario.id;
          this.scenario.set(currentScenario);
          this.selectedRoleId.set('');
          this.isJoined.set(false);
          this.chatMessages.set([]);
          this.aiTyping.set(false);
          this.draftMessage = '';
          this.roomCode.set(this.generateRoomCode());
        } else {
          this.scenario.set(currentScenario);
        }

        const roomFromQuery = query.get('room');
        const roleFromQuery = query.get('role');
        const shouldJoin = query.get('join') === '1';

        if (roomFromQuery) {
          this.roomCode.set(this.normalizeRoomCode(roomFromQuery));
        }

        if (roleFromQuery && currentScenario.roles.some((role) => role.id === roleFromQuery)) {
          this.selectedRoleId.set(roleFromQuery);
        }

        const canAutoJoin = shouldJoin && !!this.selectedRole() && this.roomCode().length >= 4;
        this.isJoined.set(canAutoJoin);

        if (this.isJoined() && this.chatMessages().length === 0) {
          this.seedAiWelcome();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.copyStatusTimer) {
      clearTimeout(this.copyStatusTimer);
    }
  }

  onRoomCodeChange(value: string): void {
    this.roomCode.set(this.normalizeRoomCode(value));
    this.syncRoute(this.isJoined());
  }

  selectRole(roleId: string): void {
    this.selectedRoleId.set(roleId);
    this.syncRoute(this.isJoined());
  }

  enterRoom(): void {
    if (!this.canJoin()) {
      return;
    }

    this.isJoined.set(true);
    this.syncRoute(true);

    if (this.chatMessages().length === 0) {
      this.seedAiWelcome();
    }
  }

  leaveRoom(): void {
    this.isJoined.set(false);
    this.syncRoute(false);
  }

  async copyShareLink(): Promise<void> {
    const link = this.shareLink();
    if (!this.isBrowser || !link) {
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      this.showCopyStatus('Invite link copied');
    } catch {
      this.showCopyStatus('Copy failed. You can copy the link manually.');
    }
  }

  openMeetInNewTab(): void {
    if (!this.isBrowser || !this.meetUrl()) {
      return;
    }
    window.open(this.meetUrl(), '_blank', 'noopener,noreferrer');
  }

  usePrompt(prompt: string): void {
    this.draftMessage = prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    const text = this.draftMessage.trim();
    if (!text || this.aiTyping()) {
      return;
    }

    this.chatMessages.update((messages) => [...messages, this.createMessage('student', text)]);
    this.draftMessage = '';
    this.aiTyping.set(true);

    const response = this.generateAiReply(text);
    const delayMs = Math.max(700, Math.min(1800, 550 + text.length * 14));

    setTimeout(() => {
      this.chatMessages.update((messages) => [...messages, this.createMessage('ai', response)]);
      this.aiTyping.set(false);
    }, delayMs);
  }

  private syncRoute(joined: boolean): void {
    const room = this.roomCode();
    const role = this.selectedRoleId();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        room: room || null,
        role: role || null,
        join: joined ? 1 : null
      },
      replaceUrl: true
    });
  }

  private seedAiWelcome(): void {
    const currentScenario = this.scenario();
    const role = this.selectedRole();
    if (!currentScenario || !role) {
      return;
    }

    const welcome = `Hi ${this.displayName}. I am your AI role coach for "${currentScenario.title}". You are playing "${role.name}". Start with one short line, and I will help you sound natural.`;
    this.chatMessages.set([this.createMessage('ai', welcome)]);
  }

  private createMessage(role: 'student' | 'ai', text: string): RoleplayMessage {
    this.messageCounter += 1;
    return {
      id: `${role}-${this.messageCounter}`,
      role,
      text,
      createdAt: new Date()
    };
  }

  private generateAiReply(message: string): string {
    const currentScenario = this.scenario();
    const selectedRole = this.selectedRole();
    const input = message.toLowerCase();

    if (!currentScenario || !selectedRole) {
      return 'Choose a role first, then I can coach your next lines.';
    }

    if (this.isGreeting(input)) {
      return `Great energy. In this scene, stay in character as ${selectedRole.name}. Start with: "${currentScenario.openingLines[0]}"`;
    }

    if (input.includes('start') || input.includes('begin') || input.includes('opening')) {
      return this.pick([
        `Opening idea: "${currentScenario.openingLines[0]}"`,
        `Try this natural start: "${currentScenario.openingLines[1] ?? currentScenario.openingLines[0]}"`,
        `You can open with: "${currentScenario.openingLines[2] ?? currentScenario.openingLines[0]}"`
      ]);
    }

    if (input.includes('correct') || input.includes('grammar')) {
      return `Good move. Here is a cleaner version: "${this.polishSentence(message)}" Keep it short and confident for the role of ${selectedRole.name}.`;
    }

    if (input.includes('stuck') || input.includes('help') || input.includes('what should i say')) {
      return `Say this next: "I understand your point, and here is my proposal." Then ask one focused question to keep the dialogue moving.`;
    }

    if (input.includes('?')) {
      return `Nice question. Answer it in character, then add one detail linked to this goal: "${currentScenario.goals[0]}". I can refine your next sentence.`;
    }

    return this.pick([
      `Good line. Make it more natural by adding a connector like "actually", "so", or "in that case".`,
      `Nice attempt. For ${selectedRole.name}, speak with clear intent and finish with a question to invite response.`,
      `Strong direction. Now shorten your sentence by 20% so it sounds more spontaneous in live conversation.`
    ]);
  }

  private polishSentence(sentence: string): string {
    const compact = sentence.replace(/\s+/g, ' ').trim();
    if (!compact) return 'Can you repeat that once more?';
    const cleaned = compact.replace(/\bi has\b/gi, 'I have').replace(/\bi goed\b/gi, 'I went');
    return cleaned;
  }

  private isGreeting(text: string): boolean {
    return ['hi', 'hello', 'hey', 'good morning', 'good evening'].some((value) => text.includes(value));
  }

  private pick(options: string[]): string {
    return options[Math.floor(Math.random() * options.length)];
  }

  private generateRoomCode(): string {
    return Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  }

  private normalizeRoomCode(value: string): string {
    const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    if (normalized.length >= 4) return normalized;
    if (!normalized) return this.generateRoomCode();
    return normalized;
  }

  private showCopyStatus(text: string): void {
    this.copyStatus.set(text);
    if (this.copyStatusTimer) {
      clearTimeout(this.copyStatusTimer);
    }
    this.copyStatusTimer = setTimeout(() => this.copyStatus.set(''), 1800);
  }

  private getPreferredName(): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return 'there';
    const fullName = `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim();
    if (fullName) return fullName;
    if (currentUser.email) return currentUser.email.split('@')[0];
    return 'there';
  }
}
