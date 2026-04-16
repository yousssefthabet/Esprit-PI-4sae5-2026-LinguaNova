import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private _active = false;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.synth = window.speechSynthesis;
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) { resolve(); return; }
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      this.synth.speak(utterance);
    });
  }

  stopSpeaking(): void {
    this.synth?.cancel();
  }

  get isSTTSupported(): boolean {
    return this.recognition !== null;
  }

  listen(): Observable<string> {
    const subject = new Subject<string>();
    if (!this.recognition) {
      subject.error('Speech recognition is not supported in this browser.');
      return subject.asObservable();
    }
    this._active = true;
    this.recognition.onresult = (event: any) => {
      this._active = false;
      const transcript: string = event.results[0][0].transcript.toLowerCase().trim();
      this.zone.run(() => {
        subject.next(transcript);
        subject.complete();
      });
    };
    this.recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'audio-capture') return;
      this._active = false;
      this.zone.run(() => { subject.error(event.error ?? 'unknown error'); });
    };
    this.recognition.onend = () => {
      if (this._active && !subject.closed) {
        try { this.recognition.start(); } catch (_) {}
      }
    };
    this.recognition.start();
    return subject.asObservable();
  }

  stopListening(): void {
    this._active = false;
    try { this.recognition?.abort(); } catch (_) {}
  }
}
