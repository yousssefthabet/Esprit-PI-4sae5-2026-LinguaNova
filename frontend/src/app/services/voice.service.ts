import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VoiceService {
    private synth = window.speechSynthesis;
    private recognition: any = null;

    /** Tracks whether listen() is still expecting a result (for keep-alive restart). */
    private _active = false;

    constructor(private zone: NgZone) {
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

    /** Read text aloud. Returns a promise that resolves when speech finishes. */
    speak(text: string): Promise<void> {
        return new Promise((resolve) => {
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

    /** Stop any ongoing speech. */
    stopSpeaking(): void {
        this.synth.cancel();
    }

    /** Returns whether STT is supported in this browser. */
    get isSTTSupported(): boolean {
        return this.recognition !== null;
    }

    /**
     * Start listening for a single utterance.
     *
     * The browser's SpeechRecognition stops itself after a short silence.
     * This method keeps the mic alive by restarting recognition in onend
     * whenever `_active` is still true (i.e. the caller hasn't called
     * stopListening() yet and no result has been received).
     *
     * Returns an Observable that emits the lowercase transcript then completes.
     */
    listen(): Observable<string> {
        const subject = new Subject<string>();

        if (!this.recognition) {
            subject.error('Speech recognition is not supported in this browser.');
            return subject.asObservable();
        }

        this._active = true;

        this.recognition.onresult = (event: any) => {
            // Real result received — stop the keep-alive loop.
            this._active = false;
            const transcript: string =
                event.results[0][0].transcript.toLowerCase().trim();
            this.zone.run(() => {
                subject.next(transcript);
                subject.complete();
            });
        };

        this.recognition.onerror = (event: any) => {
            // 'no-speech' just means silence timeout — not a real error.
            // onend fires right after and will restart the mic.
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                return;
            }
            // Any other error (e.g. 'not-allowed') is fatal.
            this._active = false;
            this.zone.run(() => {
                subject.error(event.error ?? 'unknown error');
            });
        };

        this.recognition.onend = () => {
            if (this._active && !subject.closed) {
                // Mic timed out but caller still needs input — restart silently.
                try { this.recognition.start(); } catch (_) { }
            }
        };

        this.recognition.start();
        return subject.asObservable();
    }

    /** Stop the mic and cancel the keep-alive loop. */
    stopListening(): void {
        this._active = false;
        try { this.recognition?.abort(); } catch (_) { }
    }
}
