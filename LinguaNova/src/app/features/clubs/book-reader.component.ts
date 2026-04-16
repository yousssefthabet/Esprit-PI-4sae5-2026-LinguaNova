import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StoryBook, getStoryBookById } from './book-storytelling.data';

interface DisplayToken {
  text: string;
  wordIndex: number | null;
}

@Component({
  selector: 'app-book-reader',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#F4FAF9] via-[#F9FAFB] to-white">
      <section class="max-w-[1200px] mx-auto px-4 md:px-8 pt-10 pb-8">
        <a
          routerLink="/clubs/book-storytelling"
          class="inline-flex items-center gap-2 text-[#2D6F6B] font-semibold hover:text-[#235855] transition-colors"
        >
          <span>Back to books</span>
        </a>
      </section>

      @if (book()) {
        <section class="max-w-[1200px] mx-auto px-4 md:px-8 pb-16">
          <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
            <aside class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-5 h-fit lg:sticky lg:top-6">
              <img [src]="book()!.cover" [alt]="book()!.title" class="w-full h-52 object-cover rounded-2xl">
              <h1 class="mt-5 text-2xl font-black text-[#243447] leading-tight">{{ book()!.title }}</h1>
              <p class="mt-1 text-gray-500">By {{ book()!.author }}</p>
              <p class="mt-4 text-gray-600 leading-relaxed">{{ book()!.summary }}</p>

              <div class="mt-6 p-4 rounded-2xl border border-[#DCE8E7] bg-[#F7FBFA]">
                <div class="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    (click)="play()"
                    [disabled]="!isSpeechSupported() || isPlaying()"
                    class="h-11 px-5 rounded-xl bg-[#2D6F6B] text-white font-bold hover:bg-[#235855] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Play
                  </button>

                  <button
                    type="button"
                    (click)="stop()"
                    [disabled]="!isSpeechSupported() || !isPlaying()"
                    class="h-11 px-5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Stop
                  </button>
                </div>

                <div class="mt-4">
                  <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">Voice</label>
                  <select
                    class="mt-1 w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
                    [(ngModel)]="selectedVoiceUri"
                    [disabled]="!isSpeechSupported() || isPlaying()"
                  >
                    @for (voice of voices(); track voice.voiceURI) {
                      <option [value]="voice.voiceURI">{{ voice.name }} ({{ voice.lang }})</option>
                    }
                  </select>
                </div>

                <div class="mt-4">
                  <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <span>Speed</span>
                    <span>{{ speechRate.toFixed(2) }}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.05"
                    [(ngModel)]="speechRate"
                    [disabled]="!isSpeechSupported() || isPlaying()"
                    class="mt-2 w-full accent-[#2D6F6B]"
                  >
                </div>

                <div class="mt-4">
                  <div class="h-2 rounded-full bg-[#D9E8E6] overflow-hidden">
                    <div class="h-full bg-[#2D6F6B] transition-all duration-100" [style.width.%]="progressPercent()"></div>
                  </div>
                  <p class="mt-2 text-xs text-gray-500">
                    {{ currentWordIndex() >= 0 ? (currentWordIndex() + 1) : 0 }} / {{ totalWords }}
                    words
                  </p>
                </div>

                @if (!isSpeechSupported()) {
                  <p class="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    Text-to-speech is not available in this browser.
                  </p>
                }
              </div>
            </aside>

            <article class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-6 md:p-8">
              <div class="mb-5">
                <h2 class="text-2xl font-black text-[#243447]">AI Reading Mode</h2>
                <p class="text-gray-600 mt-2">
                  Press Play to hear the story. The current word is highlighted in real time while the narrator reads.
                </p>
              </div>

              <div
                #textContainer
                class="rounded-2xl border border-[#E8EEEE] bg-[#FCFEFE] p-5 md:p-7 text-[1.08rem] leading-[2.1] text-[#2B3646]"
              >
                @for (token of displayTokens; track $index) {
                  @if (token.wordIndex === null) {
                    <span class="whitespace-pre-wrap">{{ token.text }}</span>
                  } @else {
                    <span
                      [attr.data-word-index]="token.wordIndex"
                      class="inline rounded px-0.5 transition-colors duration-100"
                      [class.bg-[#BFE6E1]]="token.wordIndex === currentWordIndex()"
                      [class.text-[#123B38]]="token.wordIndex === currentWordIndex()"
                    >
                      {{ token.text }}
                    </span>
                  }
                }
              </div>
            </article>
          </div>
        </section>
      }
    </div>
  `
})
export class BookReaderComponent implements OnDestroy {
  @ViewChild('textContainer') private textContainer?: ElementRef<HTMLElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private utterance: SpeechSynthesisUtterance | null = null;
  private wordStarts: number[] = [];
  private spokenWords: string[] = [];
  private lastScrolledWordIndex = -1;

  readonly book = signal<StoryBook | null>(null);
  readonly voices = signal<SpeechSynthesisVoice[]>([]);
  readonly isPlaying = signal(false);
  readonly currentWordIndex = signal(-1);
  readonly progressPercent = signal(0);
  readonly isSpeechSupported = signal(false);

  displayTokens: DisplayToken[] = [];
  totalWords = 0;
  selectedVoiceUri = '';
  speechRate = 1;

  constructor() {
    this.isSpeechSupported.set(this.isBrowser && typeof window.speechSynthesis !== 'undefined');
    this.loadBookFromRoute();
    this.initializeVoices();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  play(): void {
    if (!this.isSpeechSupported()) {
      return;
    }
    if (!this.book() || this.spokenWords.length === 0) {
      return;
    }

    this.stop();

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(this.spokenWords.join(' '));
    utterance.lang = 'en-US';
    utterance.rate = this.speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const selectedVoice = this.voices().find(v => v.voiceURI === this.selectedVoiceUri);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onstart = () => {
      this.isPlaying.set(true);
      this.currentWordIndex.set(0);
      this.progressPercent.set(0);
      this.lastScrolledWordIndex = -1;
      this.scrollToWord(0, true);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.charIndex >= 0) {
        const idx = this.findWordIndexByChar(event.charIndex);
        if (idx >= 0) {
          this.currentWordIndex.set(idx);
          this.progressPercent.set(((idx + 1) / this.totalWords) * 100);
          this.scrollToWord(idx, false);
        }
      }
    };

    utterance.onend = () => {
      this.isPlaying.set(false);
      this.progressPercent.set(100);
      this.currentWordIndex.set(this.totalWords > 0 ? this.totalWords - 1 : -1);
    };

    utterance.onerror = () => {
      this.isPlaying.set(false);
    };

    this.utterance = utterance;
    synth.speak(utterance);
  }

  stop(): void {
    if (!this.isSpeechSupported()) {
      return;
    }
    window.speechSynthesis.cancel();
    this.utterance = null;
    this.isPlaying.set(false);
    this.currentWordIndex.set(-1);
    this.progressPercent.set(0);
    this.lastScrolledWordIndex = -1;
  }

  private loadBookFromRoute(): void {
    const bookId = this.route.snapshot.paramMap.get('bookId');
    if (!bookId) {
      this.router.navigate(['/clubs/book-storytelling']);
      return;
    }

    const selectedBook = getStoryBookById(bookId);
    if (!selectedBook) {
      this.router.navigate(['/clubs/book-storytelling']);
      return;
    }

    this.book.set(selectedBook);
    this.prepareTokens(selectedBook.content);
  }

  private prepareTokens(content: string): void {
    const rawTokens = content.match(/(\s+|[^\s]+)/g) ?? [];
    const displayTokens: DisplayToken[] = [];
    const spokenWords: string[] = [];
    let wordIndex = 0;

    for (const token of rawTokens) {
      const cleaned = token.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '');
      if (cleaned && /[A-Za-z0-9]/.test(cleaned)) {
        displayTokens.push({ text: token, wordIndex });
        spokenWords.push(cleaned);
        wordIndex += 1;
      } else {
        displayTokens.push({ text: token, wordIndex: null });
      }
    }

    this.displayTokens = displayTokens;
    this.spokenWords = spokenWords;
    this.totalWords = spokenWords.length;
    this.wordStarts = this.computeWordStarts(spokenWords);
  }

  private computeWordStarts(words: string[]): number[] {
    const starts: number[] = [];
    let cursor = 0;
    for (const word of words) {
      starts.push(cursor);
      cursor += word.length + 1;
    }
    return starts;
  }

  private findWordIndexByChar(charIndex: number): number {
    if (this.wordStarts.length === 0) return -1;
    let left = 0;
    let right = this.wordStarts.length - 1;
    let answer = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this.wordStarts[mid] <= charIndex) {
        answer = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return answer;
  }

  private initializeVoices(): void {
    if (!this.isSpeechSupported()) {
      return;
    }

    const synth = window.speechSynthesis;

    const load = () => {
      const allVoices = synth.getVoices();
      const englishVoices = allVoices.filter(v => v.lang.toLowerCase().startsWith('en'));
      const chosen = englishVoices.length > 0 ? englishVoices : allVoices;
      this.voices.set(chosen);

      if (!this.selectedVoiceUri && chosen.length > 0) {
        this.selectedVoiceUri = chosen[0].voiceURI;
      }
    };

    load();
    synth.onvoiceschanged = load;
  }

  private scrollToWord(wordIndex: number, instant: boolean): void {
    if (Math.abs(wordIndex - this.lastScrolledWordIndex) < 4 && !instant) {
      return;
    }

    this.lastScrolledWordIndex = wordIndex;
    const container = this.textContainer?.nativeElement;
    if (!container) {
      return;
    }

    const target = container.querySelector<HTMLElement>(`[data-word-index="${wordIndex}"]`);
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: instant ? 'auto' : 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }
}
