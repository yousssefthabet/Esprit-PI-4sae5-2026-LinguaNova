import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AccessibilityStateService } from './accessibility-state.service';

@Injectable({ providedIn: 'root' })
export class AccessibilityHoverSpeechService {
  private readonly accessibilityState = inject(AccessibilityStateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;
  private lastSignature = '';
  private lastSpokenAt = 0;

  handleMouseOver(event: MouseEvent): void {
    this.queueSpeakFromTarget(event.target);
  }

  handleFocusIn(event: FocusEvent): void {
    this.queueSpeakFromTarget(event.target);
  }

  stop(): void {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    if (!this.isBrowser || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    this.lastSignature = '';
  }

  private queueSpeakFromTarget(target: EventTarget | null): void {
    if (!this.accessibilityState.enabled()) {
      return;
    }
    if (!this.isBrowser || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      return;
    }
    if (!(target instanceof Element)) {
      return;
    }

    const host = target.closest<HTMLElement>('button, a, [role="button"], input, textarea, select, summary, [aria-label], [data-accessibility-speak]');
    if (!host) {
      return;
    }
    if (host.closest('app-accessibility-panel')) {
      return;
    }

    const text = this.extractSpeakableText(host);
    if (!text) {
      return;
    }

    const signature = `${host.tagName}:${text}`;
    const now = Date.now();
    if (signature === this.lastSignature && now - this.lastSpokenAt < 1400) {
      return;
    }

    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }

    this.hoverTimer = setTimeout(() => {
      this.lastSignature = signature;
      this.lastSpokenAt = Date.now();
      this.speak(text);
    }, 220);
  }

  private extractSpeakableText(element: HTMLElement): string {
    const ariaLabel = (element.getAttribute('aria-label') ?? '').trim();
    if (ariaLabel) {
      return ariaLabel.slice(0, 180);
    }

    if (element instanceof HTMLInputElement) {
      const candidate = (element.placeholder || element.value || '').trim();
      return candidate.slice(0, 180);
    }

    if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      const candidate = (element.getAttribute('placeholder') || element.value || '').trim();
      return candidate.slice(0, 180);
    }

    const text = (element.innerText || element.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.slice(0, 180);
  }

  private speak(text: string): void {
    if (!text) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.accessibilityState.language();
    utterance.rate = this.accessibilityState.speechRate();
    utterance.pitch = 1;
    utterance.volume = 1;

    const preferredVoice = this.accessibilityState.voice().toLowerCase();
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((voice) => voice.name.toLowerCase().includes(preferredVoice))
      || voices.find((voice) => voice.lang.toLowerCase().startsWith(utterance.lang.toLowerCase().split('-')[0]));
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

