import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AccessibilityAiService } from '../../../core/services/accessibility-ai.service';
import { AccessibilityStateService } from '../../../core/services/accessibility-state.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-accessibility-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (accessibilityState.enabled()) {
      <section
        class="fixed right-4 bottom-4 z-[60] w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-slate-700 bg-slate-950 text-slate-50 shadow-2xl accessible-surface"
        aria-label="Accessibility AI Assistant panel"
      >
        <div class="flex items-start justify-between gap-3 px-4 py-3 border-b border-slate-700">
          <div>
            <h2 class="text-sm font-extrabold uppercase tracking-wide">Accessibility AI Assistant</h2>
            <p class="text-xs text-slate-300 mt-1">Read aloud, simplify text, and transcribe audio for the current page.</p>
          </div>
          <button
            type="button"
            class="px-2 py-1 rounded-md border border-slate-500 text-xs font-bold hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            (click)="disableMode()"
            aria-label="Disable accessible mode"
          >
            Close
          </button>
        </div>

        <div class="px-4 py-3 space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              class="px-3 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed accessible-action"
              [disabled]="isBusy()"
              (click)="readCurrentContent()"
              aria-label="Read current content aloud"
            >
              Read aloud
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 disabled:opacity-60 disabled:cursor-not-allowed accessible-action"
              [disabled]="isBusy()"
              (click)="openAudioPicker()"
              aria-label="Upload audio for speech to text"
            >
              Speech to text
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed accessible-action"
              [disabled]="isBusy()"
              (click)="simplifyCurrentContent()"
              aria-label="Simplify current content text"
            >
              Simplify text
            </button>
          </div>

          <input
            #audioPicker
            type="file"
            accept="audio/*"
            class="hidden"
            (change)="onAudioSelected($event)"
            aria-label="Audio file picker for speech to text"
          >

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Voice
              <select
                class="mt-1 w-full h-10 rounded-lg border border-slate-600 bg-slate-900 px-2 text-sm text-slate-100"
                [ngModel]="accessibilityState.voice()"
                (ngModelChange)="accessibilityState.setVoice($event)"
                aria-label="Voice selector"
              >
                @for (voice of availableVoices; track voice) {
                  <option [value]="voice">{{ voice }}</option>
                }
              </select>
            </label>

            <label class="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Language
              <select
                class="mt-1 w-full h-10 rounded-lg border border-slate-600 bg-slate-900 px-2 text-sm text-slate-100"
                [ngModel]="accessibilityState.language()"
                (ngModelChange)="accessibilityState.setLanguage($event)"
                aria-label="Language selector"
              >
                @for (language of availableLanguages; track language.code) {
                  <option [value]="language.code">{{ language.label }}</option>
                }
              </select>
            </label>
          </div>

          <label class="block text-xs font-semibold uppercase tracking-wide text-slate-300">
            Speech rate: {{ accessibilityState.speechRate().toFixed(2) }}x
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              class="mt-2 w-full accent-cyan-400"
              [ngModel]="accessibilityState.speechRate()"
              (ngModelChange)="onSpeechRateChange($event)"
              aria-label="Speech rate slider"
            >
          </label>

          @if (isBusy()) {
            <p class="text-xs text-cyan-300 font-semibold">{{ busyLabel() }}</p>
          }

          @if (accessibilityState.lastError()) {
            <p class="text-xs text-rose-300 bg-rose-950/50 border border-rose-800 rounded-lg px-3 py-2" role="alert">
              {{ accessibilityState.lastError() }}
            </p>
          }

          @if (accessibilityState.lastTranscription()) {
            <div class="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2">
              <p class="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Last transcription</p>
              <p class="text-sm text-slate-100 mt-1">{{ accessibilityState.lastTranscription() }}</p>
            </div>
          }

          @if (accessibilityState.audioSource()) {
            <audio
              controls
              class="w-full mt-1"
              [src]="accessibilityState.audioSource()!"
              aria-label="Generated text to speech audio player"
            ></audio>
          }
        </div>
      </section>
    }
  `
})
export class AccessibilityPanelComponent {
  @ViewChild('audioPicker') private audioPicker?: ElementRef<HTMLInputElement>;

  protected readonly accessibilityState = inject(AccessibilityStateService);
  private readonly accessibilityAiService = inject(AccessibilityAiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly isBusy = signal(false);
  readonly busyAction = signal<'tts' | 'stt' | 'simplify' | null>(null);

  readonly availableVoices = ['alloy', 'nova', 'aria', 'echo'];
  readonly availableLanguages = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'fr-FR', label: 'French (FR)' },
    { code: 'ar-TN', label: 'Arabic (TN)' }
  ];

  disableMode(): void {
    this.accessibilityState.setMode(false);
  }

  onSpeechRateChange(value: number | string): void {
    this.accessibilityState.setSpeechRate(Number(value));
  }

  openAudioPicker(): void {
    if (this.isBusy()) {
      return;
    }
    this.accessibilityState.clearError();
    this.audioPicker?.nativeElement.click();
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.isBusy.set(true);
    this.busyAction.set('stt');
    this.accessibilityState.clearError();

    this.accessibilityAiService.speechToText(file, this.currentUserId()).pipe(
      finalize(() => {
        this.isBusy.set(false);
        this.busyAction.set(null);
        input.value = '';
      })
    ).subscribe({
      next: (response) => {
        this.accessibilityState.setTranscription(response.text);
      },
      error: (error) => {
        this.accessibilityState.setError(this.formatApiError('Speech-to-text', error, 'Speech-to-text failed. Please try another audio file.'));
      }
    });
  }

  readCurrentContent(): void {
    const context = this.resolvePageContext();
    if (!context) {
      this.accessibilityState.setError('No content is registered on this page for text-to-speech.');
      return;
    }

    this.isBusy.set(true);
    this.busyAction.set('tts');
    this.accessibilityState.clearError();

    this.accessibilityAiService.textToSpeech({
      text: context.content,
      language: this.accessibilityState.language(),
      voice: this.accessibilityState.voice(),
      speechRate: this.accessibilityState.speechRate(),
      userId: this.currentUserId()
    }).pipe(
      finalize(() => {
        this.isBusy.set(false);
        this.busyAction.set(null);
      })
    ).subscribe({
      next: (response) => {
        const audioDataUrl = `data:${response.mimeType};base64,${response.audioBase64}`;
        this.accessibilityState.setAudioSource(context.pageId, audioDataUrl);
      },
      error: (error) => {
        if (this.tryBrowserTextToSpeech(context.content)) {
          this.accessibilityState.clearError();
          return;
        }
        this.accessibilityState.setError(this.formatApiError('Text-to-speech', error, 'Text-to-speech failed. Please try again.'));
      }
    });
  }

  simplifyCurrentContent(): void {
    const context = this.resolvePageContext();
    if (!context) {
      this.accessibilityState.setError('No content is registered on this page for simplification.');
      return;
    }

    this.isBusy.set(true);
    this.busyAction.set('simplify');
    this.accessibilityState.clearError();

    this.accessibilityAiService.simplifyText({
      text: context.content,
      userId: this.currentUserId()
    }).pipe(
      finalize(() => {
        this.isBusy.set(false);
        this.busyAction.set(null);
      })
    ).subscribe({
      next: (response) => {
        this.accessibilityState.setSimplifiedText(context.pageId, response.simplifiedText);
      },
      error: (error) => {
        const localFallback = this.localSimplifyText(context.content);
        if (localFallback) {
          this.accessibilityState.setSimplifiedText(context.pageId, localFallback);
          this.accessibilityState.clearError();
          return;
        }
        this.accessibilityState.setError(this.formatApiError('Text simplification', error, 'Text simplification failed. Please try again.'));
      }
    });
  }

  busyLabel(): string {
    if (this.busyAction() === 'tts') {
      return 'Generating audio...';
    }
    if (this.busyAction() === 'stt') {
      return 'Transcribing audio...';
    }
    if (this.busyAction() === 'simplify') {
      return 'Simplifying text...';
    }
    return 'Processing...';
  }

  private currentUserId(): string | undefined {
    const id = this.authService.currentUserValue?.id;
    return id != null ? String(id) : undefined;
  }

  private resolvePageContext(): { pageId: string; content: string } | null {
    const registeredPageId = this.accessibilityState.currentPageId();
    const registeredContent = this.accessibilityState.currentContent().trim();
    if (registeredPageId && registeredContent) {
      return { pageId: registeredPageId, content: registeredContent };
    }

    const fallbackContent = this.extractReadablePageText();
    if (!fallbackContent) {
      return null;
    }

    const fallbackPageId = registeredPageId || this.currentRoutePageId();
    this.accessibilityState.registerContent(fallbackPageId, fallbackContent);
    return { pageId: fallbackPageId, content: fallbackContent };
  }

  private currentRoutePageId(): string {
    const route = this.router.url.split('?')[0].trim() || '/unknown';
    return `route:${route}`;
  }

  private extractReadablePageText(): string {
    if (!this.isBrowser) {
      return '';
    }

    const root = document.querySelector('main') ?? document.body;
    const text = (root?.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!text) {
      return '';
    }
    return text.slice(0, 8000);
  }

  private tryBrowserTextToSpeech(text: string): boolean {
    if (!this.isBrowser || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      return false;
    }

    const normalized = text.trim();
    if (!normalized) {
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(normalized.slice(0, 5000));
    utterance.lang = this.accessibilityState.language();
    utterance.rate = this.accessibilityState.speechRate();
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(utterance.lang.toLowerCase().split('-')[0]));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  }

  private localSimplifyText(text: string): string {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized) {
      return '';
    }

    const replacements: Record<string, string> = {
      approximately: 'about',
      individuals: 'people',
      numerous: 'many',
      facilitate: 'help',
      utilize: 'use',
      demonstrate: 'show',
      assistance: 'help',
      objective: 'goal',
      commence: 'start',
      terminate: 'end',
      purchase: 'buy',
      reside: 'live',
      comprehend: 'understand',
      requirements: 'needs'
    };

    let simplified = normalized;
    for (const [complexWord, easyWord] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${complexWord}\\b`, 'gi');
      simplified = simplified.replace(regex, easyWord);
    }

    const sentences = simplified.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.trim().length > 0);
    const shortSentences = sentences.slice(0, 4).map((sentence) => {
      const trimmed = sentence.trim();
      if (trimmed.length <= 120) {
        return trimmed;
      }
      return `${trimmed.slice(0, 117).trimEnd()}...`;
    });

    return shortSentences.join(' ').trim();
  }

  private formatApiError(featureName: string, error: unknown, fallbackMessage: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallbackMessage;
    }

    if (error.status === 0) {
      return `${featureName} service is unreachable. Check that event-service is running on port 8085.`;
    }

    if (error.status === 404) {
      return `${featureName} endpoint not found (404). Restart event-service to load the latest accessibility controller.`;
    }

    const backendMessage = this.extractBackendMessage(error);
    if (backendMessage) {
      return `${featureName} failed: ${backendMessage}`;
    }

    return `${featureName} failed with status ${error.status}.`;
  }

  private extractBackendMessage(error: HttpErrorResponse): string {
    const payload = error.error;
    if (typeof payload === 'string' && payload.trim()) {
      return payload.trim();
    }

    if (payload && typeof payload === 'object') {
      const message = (payload as { message?: string; error?: string }).message
        || (payload as { message?: string; error?: string }).error;
      if (typeof message === 'string' && message.trim()) {
        return message.trim();
      }
    }

    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message.trim();
    }

    return '';
  }
}
