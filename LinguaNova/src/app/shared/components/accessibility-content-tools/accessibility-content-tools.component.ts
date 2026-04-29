import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject, signal } from '@angular/core';
import { AccessibilityAiService } from '../../../core/services/accessibility-ai.service';
import { AccessibilityStateService } from '../../../core/services/accessibility-state.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-accessibility-content-tools',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (accessibilityState.enabled()) {
      <section
        class="mt-6 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm accessible-surface"
        [attr.aria-label]="title + ' accessibility tools'"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-extrabold uppercase tracking-wide text-slate-700">{{ title }}</h3>
            <p class="text-xs text-slate-500 mt-1">
              Uses current Accessible Mode settings ({{ accessibilityState.language() }}, {{ accessibilityState.voice() }}, {{ accessibilityState.speechRate().toFixed(2) }}x).
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="px-3 py-2 rounded-lg bg-cyan-700 text-white text-sm font-semibold hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed accessible-action"
              [disabled]="isBusy()"
              (click)="readAloud()"
              aria-label="Read this page content aloud"
            >
              Read aloud
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed accessible-action"
              [disabled]="isBusy()"
              (click)="simplifyText()"
              aria-label="Simplify this page content"
            >
              Simplify text
            </button>
          </div>
        </div>

        @if (localError()) {
          <p class="mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2" role="alert">
            {{ localError() }}
          </p>
        }

        @if (isBusy()) {
          <p class="mt-3 text-xs text-cyan-700 font-semibold">{{ busyLabel() }}</p>
        }

        @if (activeSimplifiedText()) {
          <div class="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
            <p class="text-xs font-bold uppercase tracking-wide text-emerald-800">Simplified text</p>
            <p class="mt-2 text-sm leading-relaxed text-emerald-950">{{ activeSimplifiedText() }}</p>
          </div>
        }

        @if (activeAudioSource()) {
          <audio
            class="w-full mt-3"
            controls
            [src]="activeAudioSource()!"
            aria-label="Text to speech playback for this page"
          ></audio>
        }
      </section>
    }
  `
})
export class AccessibilityContentToolsComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) pageId = '';
  @Input({ required: true }) contentText = '';
  @Input() title = 'Content accessibility tools';

  protected readonly accessibilityState = inject(AccessibilityStateService);
  private readonly accessibilityAiService = inject(AccessibilityAiService);
  private readonly authService = inject(AuthService);

  readonly isBusy = signal(false);
  readonly busyAction = signal<'tts' | 'simplify' | null>(null);
  readonly localError = signal('');

  ngOnChanges(_: SimpleChanges): void {
    this.registerPageContent();
  }

  ngOnDestroy(): void {
    this.accessibilityState.clearContent(this.pageId);
  }

  readAloud(): void {
    this.registerPageContent();
    const content = this.contentText.trim();
    if (!content) {
      this.localError.set('No readable content is available on this page.');
      return;
    }

    this.localError.set('');
    this.isBusy.set(true);
    this.busyAction.set('tts');

    this.accessibilityAiService.textToSpeech({
      text: content,
      language: this.accessibilityState.language(),
      voice: this.accessibilityState.voice(),
      speechRate: this.accessibilityState.speechRate(),
      userId: this.currentUserId()
    }).subscribe({
      next: (response) => {
        const audioDataUrl = `data:${response.mimeType};base64,${response.audioBase64}`;
        this.accessibilityState.setAudioSource(this.pageId, audioDataUrl);
      },
      error: () => {
        this.localError.set('Unable to generate audio for this content.');
      },
      complete: () => {
        this.isBusy.set(false);
        this.busyAction.set(null);
      }
    });
  }

  simplifyText(): void {
    this.registerPageContent();
    const content = this.contentText.trim();
    if (!content) {
      this.localError.set('No text is available to simplify.');
      return;
    }

    this.localError.set('');
    this.isBusy.set(true);
    this.busyAction.set('simplify');

    this.accessibilityAiService.simplifyText({
      text: content,
      userId: this.currentUserId()
    }).subscribe({
      next: (response) => {
        this.accessibilityState.setSimplifiedText(this.pageId, response.simplifiedText);
      },
      error: () => {
        this.localError.set('Unable to simplify this content right now.');
      },
      complete: () => {
        this.isBusy.set(false);
        this.busyAction.set(null);
      }
    });
  }

  activeSimplifiedText(): string {
    if (this.accessibilityState.currentPageId() !== this.pageId) {
      return '';
    }
    return this.accessibilityState.simplifiedText();
  }

  activeAudioSource(): string | null {
    if (this.accessibilityState.currentPageId() !== this.pageId) {
      return null;
    }
    return this.accessibilityState.audioSource();
  }

  busyLabel(): string {
    if (this.busyAction() === 'tts') {
      return 'Generating audio...';
    }
    if (this.busyAction() === 'simplify') {
      return 'Simplifying content...';
    }
    return 'Processing...';
  }

  private registerPageContent(): void {
    const id = this.pageId?.trim();
    if (!id) {
      return;
    }
    this.accessibilityState.registerContent(id, this.contentText ?? '');
  }

  private currentUserId(): string | undefined {
    const id = this.authService.currentUserValue?.id;
    return id != null ? String(id) : undefined;
  }
}

