import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AccessibilityStateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly modeStorageKey = 'ln_accessibility_mode';
  private readonly languageStorageKey = 'ln_accessibility_language';
  private readonly voiceStorageKey = 'ln_accessibility_voice';
  private readonly speechRateStorageKey = 'ln_accessibility_rate';

  readonly enabled = signal<boolean>(this.readBoolean(this.modeStorageKey, false));
  readonly language = signal<string>(this.readString(this.languageStorageKey, 'en-US'));
  readonly voice = signal<string>(this.readString(this.voiceStorageKey, 'alloy'));
  readonly speechRate = signal<number>(this.readNumber(this.speechRateStorageKey, 1));

  readonly currentPageId = signal<string | null>(null);
  readonly currentContent = signal<string>('');
  readonly simplifiedText = signal<string>('');
  readonly audioSource = signal<string | null>(null);
  readonly lastTranscription = signal<string>('');
  readonly lastError = signal<string>('');

  toggleMode(): void {
    this.setMode(!this.enabled());
  }

  setMode(enabled: boolean): void {
    this.enabled.set(enabled);
    this.writeValue(this.modeStorageKey, String(enabled));
    if (!enabled) {
      this.resetRuntimeState();
    }
  }

  setLanguage(language: string): void {
    const next = language?.trim() || 'en-US';
    this.language.set(next);
    this.writeValue(this.languageStorageKey, next);
  }

  setVoice(voice: string): void {
    const next = voice?.trim() || 'alloy';
    this.voice.set(next);
    this.writeValue(this.voiceStorageKey, next);
  }

  setSpeechRate(rate: number): void {
    const normalized = Number.isFinite(rate) ? Math.max(0.5, Math.min(2.0, rate)) : 1;
    this.speechRate.set(normalized);
    this.writeValue(this.speechRateStorageKey, String(normalized));
  }

  registerContent(pageId: string, content: string): void {
    const normalizedPageId = pageId?.trim();
    if (!normalizedPageId) {
      return;
    }

    const normalizedContent = content?.trim() ?? '';
    const pageChanged = this.currentPageId() !== normalizedPageId;
    const contentChanged = this.currentContent() !== normalizedContent;

    this.currentPageId.set(normalizedPageId);
    this.currentContent.set(normalizedContent);

    if (pageChanged || contentChanged) {
      this.simplifiedText.set('');
      this.audioSource.set(null);
      this.lastError.set('');
    }
  }

  clearContent(pageId?: string): void {
    if (pageId && this.currentPageId() !== pageId) {
      return;
    }
    this.currentPageId.set(null);
    this.currentContent.set('');
    this.simplifiedText.set('');
    this.audioSource.set(null);
  }

  setSimplifiedText(pageId: string, text: string): void {
    if (this.currentPageId() !== pageId) {
      return;
    }
    this.simplifiedText.set(text?.trim() ?? '');
  }

  setAudioSource(pageId: string, source: string | null): void {
    if (this.currentPageId() !== pageId) {
      return;
    }
    this.audioSource.set(source);
  }

  setTranscription(text: string): void {
    this.lastTranscription.set(text?.trim() ?? '');
  }

  setError(message: string): void {
    this.lastError.set(message?.trim() ?? '');
  }

  clearError(): void {
    this.lastError.set('');
  }

  private resetRuntimeState(): void {
    this.simplifiedText.set('');
    this.audioSource.set(null);
    this.lastTranscription.set('');
    this.lastError.set('');
  }

  private readBoolean(key: string, fallback: boolean): boolean {
    if (!this.isBrowser) {
      return fallback;
    }
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return fallback;
    }
    return stored === 'true';
  }

  private readString(key: string, fallback: string): string {
    if (!this.isBrowser) {
      return fallback;
    }
    const stored = localStorage.getItem(key);
    return stored?.trim() ? stored : fallback;
  }

  private readNumber(key: string, fallback: number): number {
    if (!this.isBrowser) {
      return fallback;
    }
    const raw = localStorage.getItem(key);
    const parsed = raw ? Number(raw) : NaN;
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.max(0.5, Math.min(2.0, parsed));
  }

  private writeValue(key: string, value: string): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(key, value);
  }
}

