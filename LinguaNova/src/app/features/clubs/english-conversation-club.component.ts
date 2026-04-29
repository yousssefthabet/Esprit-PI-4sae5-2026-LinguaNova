import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AccessibilityContentToolsComponent } from '../../shared/components/accessibility-content-tools/accessibility-content-tools.component';
import { ClubAiStudentPanelComponent } from '../../shared/components/club-ai-student-panel/club-ai-student-panel.component';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  createdAt: Date;
}

@Component({
  selector: 'app-english-conversation-club',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AccessibilityContentToolsComponent, ClubAiStudentPanelComponent],
  template: `
    <div class="bg-gray-50/50 min-h-screen">
      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 pb-8">
        <a
          routerLink="/clubs"
          class="inline-flex items-center gap-2 text-[#2D6F6B] font-semibold hover:text-[#235855] transition-colors"
        >
          <span>Back to clubs</span>
        </a>
      </section>

      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pb-24">
        <div class="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 md:p-8">
          <h1 class="text-3xl md:text-4xl font-extrabold text-[#2D3748] mb-3">English Conversation Club</h1>
          <p class="text-gray-600 leading-relaxed mb-6">
            Welcome to your conversation room. Chat naturally with the AI tutor, practice speaking patterns, roleplay daily situations, and improve fluency.
          </p>

          <app-accessibility-content-tools
            [pageId]="'club-english-conversation'"
            [title]="'Conversation accessibility tools'"
            [contentText]="accessibleContentText()"
          />

          <app-club-ai-student-panel [clubId]="'english-conversation'" />

          <div class="mb-4 flex flex-wrap gap-2">
            @for (prompt of quickPrompts; track prompt) {
              <button
                type="button"
                (click)="applyQuickPrompt(prompt)"
                class="px-3 py-1.5 rounded-full text-sm bg-[#2D6F6B]/10 text-[#2D6F6B] hover:bg-[#2D6F6B]/20 transition-colors"
              >
                {{ prompt }}
              </button>
            }
          </div>

          <div #scrollContainer class="h-[420px] overflow-y-auto rounded-xl bg-gray-50 p-4 border border-gray-100">
            @for (message of chatMessages(); track message.id) {
              <div class="mb-3 flex" [class.justify-end]="message.role === 'user'" [class.justify-start]="message.role === 'bot'">
                <div
                  class="max-w-[85%] px-4 py-3 rounded-2xl shadow-sm"
                  [class.bg-[#2D6F6B]]="message.role === 'user'"
                  [class.text-white]="message.role === 'user'"
                  [class.bg-white]="message.role === 'bot'"
                  [class.text-gray-800]="message.role === 'bot'"
                >
                  <p class="leading-relaxed whitespace-pre-line">{{ message.text }}</p>
                  <p class="text-xs mt-2 opacity-70">{{ message.createdAt | date:'HH:mm' }}</p>
                </div>
              </div>
            }

            @if (botTyping()) {
              <div class="mb-3 flex justify-start">
                <div class="max-w-[85%] px-4 py-3 rounded-2xl shadow-sm bg-white text-gray-800">
                  <p class="leading-relaxed">Typing...</p>
                </div>
              </div>
            }
          </div>

          <div class="mt-4 flex gap-3">
            <input
              type="text"
              [(ngModel)]="draftMessage"
              (keydown.enter)="sendMessage()"
              placeholder="Write your message in English..."
              class="flex-1 h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[#2D6F6B]/30"
            >
            <button
              type="button"
              (click)="sendMessage()"
              [disabled]="!draftMessage.trim() || botTyping()"
              class="h-12 px-6 rounded-xl bg-[#2D6F6B] text-white font-semibold hover:bg-[#235855] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>

          <div class="mt-4">
            <button
              type="button"
              (click)="resetConversation()"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset chat
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class EnglishConversationClubComponent {
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLElement>;

  private readonly authService = inject(AuthService);
  private messageCounter = 0;

  readonly botTyping = signal(false);
  readonly chatMessages = signal<ChatMessage[]>([]);

  readonly quickPrompts = [
    'Introduce yourself and ask me one question.',
    'Correct this sentence: I has went to school yesterday.',
    'Roleplay: We are ordering coffee.'
  ];
  readonly accessibleContentText = computed(() => {
    const intro = 'English Conversation Club. Practice natural conversation with an AI tutor.';
    const prompts = `Quick prompts: ${this.quickPrompts.join(' ')}`;
    const messages = this.chatMessages()
      .map((message) => `${message.role === 'user' ? 'Student' : 'Tutor'}: ${message.text}`)
      .join(' ');
    return `${intro} ${prompts} ${messages}`.trim();
  });

  draftMessage = '';

  constructor() {
    const name = this.getPreferredName();
    this.chatMessages.set([
      this.createMessage(
        'bot',
        `Hi ${name}. I am your conversation partner. Let us chat in natural English. What would you like to practice first?`
      )
    ]);
  }

  resetConversation(): void {
    const name = this.getPreferredName();
    this.chatMessages.set([
      this.createMessage('bot', `Fresh start, ${name}. Tell me a topic and we can begin right away.`)
    ]);
    this.botTyping.set(false);
    this.draftMessage = '';
    this.scrollToBottom();
  }

  applyQuickPrompt(prompt: string): void {
    this.draftMessage = prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    const text = this.draftMessage.trim();
    if (!text || this.botTyping()) {
      return;
    }

    this.chatMessages.update(messages => [...messages, this.createMessage('user', text)]);
    this.draftMessage = '';
    this.botTyping.set(true);
    this.scrollToBottom();

    const response = this.generateHumanLikeReply(text);
    const delayMs = Math.max(650, Math.min(1900, 500 + text.length * 18));

    setTimeout(() => {
      this.chatMessages.update(messages => [...messages, this.createMessage('bot', response)]);
      this.botTyping.set(false);
      this.scrollToBottom();
    }, delayMs);
  }

  private createMessage(role: 'user' | 'bot', text: string): ChatMessage {
    this.messageCounter += 1;
    return {
      id: `${role}-${this.messageCounter}`,
      role,
      text,
      createdAt: new Date()
    };
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 0);
  }

  private getPreferredName(): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return 'there';
    const fullName = `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim();
    if (fullName) return fullName;
    if (currentUser.email) return currentUser.email.split('@')[0];
    return 'there';
  }

  private generateHumanLikeReply(message: string): string {
    const text = message.toLowerCase();

    if (this.isGreeting(text)) {
      return this.pick([
        'Hey, nice to meet you. Tell me how your day is going, and I will reply naturally.',
        'Hi. Great to chat with you. Do you want casual conversation, grammar help, or roleplay?',
        'Hello. Let us talk like real friends. Share one sentence about your day.'
      ]);
    }

    if (text.includes('correct') || text.includes('grammar') || text.includes('sentence')) {
      return this.buildGrammarReply(message);
    }

    if (text.includes('roleplay') || text.includes('order') || text.includes('coffee') || text.includes('restaurant')) {
      return this.pick([
        'Perfect. Let us roleplay now.\nBarista: Hi, welcome. What can I get for you today?',
        'Great choice. We will do a real-life roleplay.\nServer: Good evening. Would you like to start with a drink?',
        'Nice. Roleplay helps fluency fast.\nShop assistant: Hello. What are you looking for today?'
      ]);
    }

    if (text.includes('vocab') || text.includes('vocabulary') || text.includes('word')) {
      return this.pick([
        'Nice focus. Give me one topic, and I will teach 8 useful words with quick examples.',
        'Good plan. Which area do you want: travel, study, work, or daily conversation?',
        'Sure. I can build vocabulary through mini-dialogues so words stay in your memory.'
      ]);
    }

    if (text.includes('?')) {
      return this.pick([
        'Good question. Here is a natural answer: ' + this.naturalMirror(message) + '\nNow your turn: answer me in one short sentence.',
        'I like that question. My quick answer: ' + this.naturalMirror(message) + '\nDo you want a formal and an informal version too?',
        'Great question. I would say: ' + this.naturalMirror(message) + '\nCan you answer as if we are chatting face to face?'
      ]);
    }

    return this.pick([
      'That sounds good. I understood you clearly. Can you add one more detail?',
      'Nice sentence. You are doing well. Try saying the same idea in past tense.',
      'Good point. Let us keep the flow. What happened next?'
    ]);
  }

  private buildGrammarReply(originalMessage: string): string {
    const clean = originalMessage.trim();
    if (clean.toLowerCase().includes('i has went to school yesterday')) {
      return 'Great practice sentence.\nCorrect version: "I went to school yesterday."\nReason: in simple past, use "went" directly, not "has went". Want 3 more examples?';
    }

    return this.pick([
      'Sure. Send the exact sentence and I will return: corrected version, short reason, and a more natural version.',
      'Absolutely. Paste your sentence, and I will fix grammar while keeping your meaning and tone.',
      'Yes. Share one sentence and I will correct it like a human tutor, step by step.'
    ]);
  }

  private isGreeting(text: string): boolean {
    return ['hi', 'hello', 'hey', 'good morning', 'good evening'].some(g => text.includes(g));
  }

  private naturalMirror(input: string): string {
    const compact = input.replace(/\s+/g, ' ').trim();
    if (!compact) {
      return 'Tell me your exact question and I will answer clearly.';
    }
    return `In everyday English, I would answer this way: "${compact}"`;
  }

  private pick(options: string[]): string {
    return options[Math.floor(Math.random() * options.length)];
  }
}
