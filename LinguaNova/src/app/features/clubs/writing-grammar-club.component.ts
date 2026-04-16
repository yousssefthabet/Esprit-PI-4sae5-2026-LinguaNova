import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DictationPassage, WRITING_DICTATION_PASSAGES } from './writing-grammar.data';

interface CorrectionItem {
  position: number;
  expected: string;
  received: string;
}

interface DictationResult {
  correctWords: number;
  totalWords: number;
  scoreOverTen: number;
  corrections: CorrectionItem[];
  matchedExpected: boolean[];
}

interface DisplayToken {
  text: string;
  wordIndex: number | null;
}

interface WordToken {
  original: string;
  normalized: string;
}

interface LcsPair {
  i: number;
  j: number;
}

@Component({
  selector: 'app-writing-grammar-club',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#F5FBFA] via-[#F9FAFB] to-white">
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
          <h1 class="text-3xl md:text-5xl font-black text-[#243447] leading-tight">Writing & Grammar Club</h1>
          <p class="mt-4 text-base md:text-lg text-[#4B5563] leading-relaxed max-w-4xl">
            Listen to the AI dictation, write the paragraph, then click Finish to get a score on 10. The system highlights the incorrect words and gives you corrected words instantly.
          </p>
        </div>

        <div class="mt-8 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          <aside class="space-y-6">
            <div class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-5">
              <h2 class="text-lg font-extrabold text-[#243447]">AI dictation setup</h2>
              <p class="text-sm text-gray-600 mt-1">Choose a paragraph, then use Play and write what you hear.</p>

              <div class="mt-4">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">Paragraph</label>
                <select
                  class="mt-1 w-full h-11 px-3 rounded-xl border border-gray-200 text-sm"
                  [ngModel]="selectedPassageId()"
                  (ngModelChange)="onPassageChange($event)"
                  [disabled]="isPlaying()"
                >
                  @for (passage of passages; track passage.id) {
                    <option [value]="passage.id">
                      {{ passage.title }} - {{ passage.level }}
                    </option>
                  }
                </select>
              </div>

              <div class="mt-4 rounded-2xl border border-[#DDE9E8] bg-[#F7FBFA] p-4">
                <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Topic</p>
                <p class="text-sm text-[#314155] mt-1">{{ selectedPassage()?.topic }}</p>
                <p class="text-xs text-gray-500 mt-3">
                  Expected length: {{ expectedWordCount() }} words
                </p>
              </div>

              <div class="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  (click)="playDictation()"
                  [disabled]="!isSpeechSupported() || isPlaying()"
                  class="h-11 px-5 rounded-xl bg-[#2D6F6B] text-white font-bold hover:bg-[#235855] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Play
                </button>
                <button
                  type="button"
                  (click)="stopDictation()"
                  [disabled]="!isSpeechSupported() || !isPlaying()"
                  class="h-11 px-5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Stop
                </button>
                <button
                  type="button"
                  (click)="randomizePassage()"
                  [disabled]="isPlaying()"
                  class="h-11 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  New paragraph
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
                  max="1.2"
                  step="0.05"
                  [(ngModel)]="speechRate"
                  [disabled]="!isSpeechSupported() || isPlaying()"
                  class="mt-2 w-full accent-[#2D6F6B]"
                >
              </div>

              @if (!isSpeechSupported()) {
                <p class="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  Text-to-speech is not available in this browser.
                </p>
              }
            </div>
          </aside>

          <div class="space-y-6">
            <div class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-6 md:p-7">
              <h2 class="text-2xl font-black text-[#243447]">Student writing area</h2>
              <p class="mt-2 text-gray-600">
                Write the paragraph exactly as dictated. When finished, click Finish for grammar scoring and correction.
              </p>

              <textarea
                [(ngModel)]="studentParagraph"
                rows="10"
                class="mt-5 w-full rounded-2xl border border-gray-200 p-4 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2D6F6B]/30"
                placeholder="Write the dictated paragraph here..."
              ></textarea>

              <div class="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  (click)="finishDictation()"
                  [disabled]="!studentParagraph.trim()"
                  class="h-11 px-6 rounded-xl bg-[#243447] text-white font-bold hover:bg-[#1B2938] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finish
                </button>
                <button
                  type="button"
                  (click)="resetWriting()"
                  class="h-11 px-5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Reset text
                </button>
              </div>
            </div>

            @if (result()) {
              <div class="bg-white rounded-3xl border border-[#E6ECEC] shadow-sm p-6 md:p-7">
                <h3 class="text-2xl font-black text-[#243447]">AI Correction Result</h3>

                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="rounded-2xl border border-[#DDE9E8] bg-[#F7FBFA] p-4">
                    <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Score</p>
                    <p class="mt-1 text-3xl font-black text-[#1C6A62]">{{ result()!.scoreOverTen.toFixed(1) }}/10</p>
                  </div>
                  <div class="rounded-2xl border border-[#DDE9E8] bg-[#F7FBFA] p-4">
                    <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Correct words</p>
                    <p class="mt-1 text-3xl font-black text-[#243447]">{{ result()!.correctWords }}/{{ result()!.totalWords }}</p>
                  </div>
                  <div class="rounded-2xl border border-[#DDE9E8] bg-[#F7FBFA] p-4">
                    <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Accuracy</p>
                    <p class="mt-1 text-3xl font-black text-[#243447]">{{ accuracyPercent() }}%</p>
                  </div>
                </div>

                <div class="mt-6">
                  <h4 class="text-lg font-extrabold text-[#243447]">Corrected paragraph</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    Green means correct word. Red means the expected correct word.
                  </p>
                  <div class="mt-3 rounded-2xl border border-[#E8EEEE] bg-[#FCFEFE] p-4 leading-8 text-[#2B3646]">
                    @for (token of displayTokens; track $index) {
                      @if (token.wordIndex === null) {
                        <span class="whitespace-pre-wrap">{{ token.text }}</span>
                      } @else {
                        <span
                          class="inline rounded px-0.5"
                          [class.bg-[#D5F4EE]]="result()!.matchedExpected[token.wordIndex]"
                          [class.text-[#123B38]]="result()!.matchedExpected[token.wordIndex]"
                          [class.bg-[#FDE2E2]]="!result()!.matchedExpected[token.wordIndex]"
                          [class.text-[#7D1A1A]]="!result()!.matchedExpected[token.wordIndex]"
                        >
                          {{ token.text }}
                        </span>
                      }
                    }
                  </div>
                </div>

                <div class="mt-6">
                  <h4 class="text-lg font-extrabold text-[#243447]">Wrong words corrected</h4>
                  @if (result()!.corrections.length === 0) {
                    <p class="mt-2 text-sm font-semibold text-[#1C6A62]">
                      Perfect writing. All expected words are correct.
                    </p>
                  } @else {
                    <div class="mt-3 overflow-x-auto rounded-2xl border border-gray-100">
                      <table class="w-full min-w-[560px]">
                        <thead class="bg-gray-50">
                          <tr>
                            <th class="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Position</th>
                            <th class="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">You wrote</th>
                            <th class="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Correct word</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (item of result()!.corrections; track $index) {
                            <tr class="border-t border-gray-100">
                              <td class="px-4 py-3 text-sm font-semibold text-gray-500">#{{ item.position }}</td>
                              <td class="px-4 py-3 text-sm text-[#7D1A1A]">{{ item.received }}</td>
                              <td class="px-4 py-3 text-sm text-[#1C6A62] font-semibold">{{ item.expected }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `
})
export class WritingGrammarClubComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private utterance: SpeechSynthesisUtterance | null = null;

  readonly passages: DictationPassage[] = WRITING_DICTATION_PASSAGES;
  readonly selectedPassageId = signal(this.passages[0]?.id ?? '');
  readonly selectedPassage = computed(
    () => this.passages.find((passage) => passage.id === this.selectedPassageId()) ?? null
  );
  readonly expectedWordCount = computed(() => this.extractWordTokens(this.selectedPassage()?.text ?? '').length);

  readonly isSpeechSupported = signal(false);
  readonly isPlaying = signal(false);
  readonly voices = signal<SpeechSynthesisVoice[]>([]);
  readonly result = signal<DictationResult | null>(null);

  selectedVoiceUri = '';
  speechRate = 0.95;
  studentParagraph = '';
  displayTokens: DisplayToken[] = [];

  constructor() {
    this.isSpeechSupported.set(this.isBrowser && typeof window.speechSynthesis !== 'undefined');
    this.refreshDisplayTokens();
    this.initializeVoices();
  }

  ngOnDestroy(): void {
    this.stopDictation();
  }

  onPassageChange(passageId: string): void {
    this.selectedPassageId.set(passageId);
    this.studentParagraph = '';
    this.result.set(null);
    this.stopDictation();
    this.refreshDisplayTokens();
  }

  randomizePassage(): void {
    const currentId = this.selectedPassageId();
    const alternatives = this.passages.filter((passage) => passage.id !== currentId);
    if (alternatives.length === 0) return;

    const next = alternatives[Math.floor(Math.random() * alternatives.length)];
    this.onPassageChange(next.id);
  }

  playDictation(): void {
    if (!this.isSpeechSupported()) {
      return;
    }
    const passage = this.selectedPassage();
    if (!passage) {
      return;
    }

    this.stopDictation();

    const utterance = new SpeechSynthesisUtterance(passage.text);
    utterance.lang = 'en-US';
    utterance.rate = this.speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const selectedVoice = this.voices().find((voice) => voice.voiceURI === this.selectedVoiceUri);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onstart = () => this.isPlaying.set(true);
    utterance.onend = () => this.isPlaying.set(false);
    utterance.onerror = () => this.isPlaying.set(false);

    this.utterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stopDictation(): void {
    if (!this.isSpeechSupported()) {
      return;
    }
    window.speechSynthesis.cancel();
    this.utterance = null;
    this.isPlaying.set(false);
  }

  finishDictation(): void {
    const passage = this.selectedPassage();
    if (!passage) {
      return;
    }
    this.result.set(this.evaluateSubmission(passage.text, this.studentParagraph));
  }

  resetWriting(): void {
    this.studentParagraph = '';
    this.result.set(null);
  }

  accuracyPercent(): number {
    const currentResult = this.result();
    if (!currentResult || currentResult.totalWords === 0) {
      return 0;
    }
    return Math.round((currentResult.correctWords / currentResult.totalWords) * 100);
  }

  private initializeVoices(): void {
    if (!this.isSpeechSupported()) {
      return;
    }
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const allVoices = synth.getVoices();
      const englishVoices = allVoices.filter((voice) => voice.lang.toLowerCase().startsWith('en'));
      const preferred = englishVoices.length > 0 ? englishVoices : allVoices;
      this.voices.set(preferred);
      if (!this.selectedVoiceUri && preferred.length > 0) {
        this.selectedVoiceUri = preferred[0].voiceURI;
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }

  private evaluateSubmission(expectedText: string, submittedText: string): DictationResult {
    const expectedTokens = this.extractWordTokens(expectedText);
    const studentTokens = this.extractWordTokens(submittedText);

    const expectedNormalized = expectedTokens.map((token) => token.normalized);
    const studentNormalized = studentTokens.map((token) => token.normalized);

    const pairs = this.computeLcsPairs(expectedNormalized, studentNormalized);
    const expectedToStudent = new Map<number, number>();
    const matchedStudentIndices = new Set<number>();
    const matchedExpected = Array(expectedTokens.length).fill(false);

    for (const pair of pairs) {
      expectedToStudent.set(pair.i, pair.j);
      matchedStudentIndices.add(pair.j);
      matchedExpected[pair.i] = true;
    }

    const corrections: CorrectionItem[] = [];
    let studentPointer = 0;

    for (let i = 0; i < expectedTokens.length; i += 1) {
      if (expectedToStudent.has(i)) {
        studentPointer = expectedToStudent.get(i)! + 1;
        continue;
      }

      while (studentPointer < studentTokens.length && matchedStudentIndices.has(studentPointer)) {
        studentPointer += 1;
      }

      const received = studentPointer < studentTokens.length ? studentTokens[studentPointer].original : '(missing)';
      if (studentPointer < studentTokens.length) {
        studentPointer += 1;
      }

      corrections.push({
        position: i + 1,
        expected: expectedTokens[i].original,
        received
      });
    }

    const correctWords = pairs.length;
    const totalWords = expectedTokens.length;
    const scoreOverTen = totalWords === 0 ? 0 : Number(((correctWords / totalWords) * 10).toFixed(1));

    return {
      correctWords,
      totalWords,
      scoreOverTen,
      corrections,
      matchedExpected
    };
  }

  private computeLcsPairs(expected: string[], actual: string[]): LcsPair[] {
    const m = expected.length;
    const n = actual.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i += 1) {
      for (let j = 1; j <= n; j += 1) {
        if (expected[i - 1] === actual[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const pairs: LcsPair[] = [];
    let i = m;
    let j = n;

    while (i > 0 && j > 0) {
      if (expected[i - 1] === actual[j - 1]) {
        pairs.push({ i: i - 1, j: j - 1 });
        i -= 1;
        j -= 1;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        i -= 1;
      } else {
        j -= 1;
      }
    }

    return pairs.reverse();
  }

  private extractWordTokens(text: string): WordToken[] {
    const words = text.match(/[A-Za-z0-9']+/g) ?? [];
    return words
      .map((word) => ({
        original: word,
        normalized: this.normalizeWord(word)
      }))
      .filter((token) => token.normalized.length > 0);
  }

  private normalizeWord(word: string): string {
    return word.toLowerCase().replace(/[^a-z0-9']/g, '');
  }

  private refreshDisplayTokens(): void {
    const passageText = this.selectedPassage()?.text ?? '';
    const rawTokens = passageText.match(/(\s+|[^\s]+)/g) ?? [];
    const tokens: DisplayToken[] = [];
    let wordIndex = 0;

    for (const token of rawTokens) {
      const cleaned = token.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '');
      if (cleaned && /[A-Za-z0-9]/.test(cleaned)) {
        tokens.push({ text: token, wordIndex });
        wordIndex += 1;
      } else {
        tokens.push({ text: token, wordIndex: null });
      }
    }

    this.displayTokens = tokens;
  }
}

