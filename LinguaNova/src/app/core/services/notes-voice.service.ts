import { Injectable } from '@angular/core';
import { VoiceService } from './voice.service';
import { Subscription } from 'rxjs';

export type NotesVoiceState = 'BROWSING_CAHIERS' | 'BROWSING_NOTES' | 'DICTATING_TITLE' | 'DICTATING_CONTENT' | 'READING_NOTE';

export interface NotesVoiceApi {
  getCahiers: () => { name: string, id: number }[];
  getNotes: () => { title: string, content: string, id: number }[];
  openCahier: (id: number) => void;
  openNote: (id: number) => void;
  goBackToCahiers: () => void;
  startNewNote: () => void;
  setNewNoteTitle: (title: string) => void;
  setNewNoteContent: (content: string) => void;
  saveNote: () => void;
}

@Injectable({ providedIn: 'root' })
export class NotesVoiceService {
  private currentState: NotesVoiceState = 'BROWSING_CAHIERS';
  private api!: NotesVoiceApi;
  private listenSub?: Subscription;
  private voiceActive = false;

  constructor(private voiceService: VoiceService) {}

  isActive(): boolean {
    return this.voiceActive;
  }

  start(api: NotesVoiceApi): void {
    this.api = api;
    this.currentState = 'BROWSING_CAHIERS';
    this.voiceActive = true;
    this.announceCahiers();
  }

  stop(): void {
    this.voiceActive = false;
    this.voiceService.stopListening();
    this.voiceService.stopSpeaking();
    this.listenSub?.unsubscribe();
  }

  private loop(): void {
    if (!this.voiceActive) return;
    this.listenSub = this.voiceService.listen().subscribe({
      next: (transcript) => {
        this.handleTranscript(transcript);
      },
      error: () => {
        // If error (like no-speech), we just loop again if still active
        if (this.voiceActive) {
           this.loop();
        }
      }
    });
  }

  private speakAndListen(text: string): void {
    if (!this.voiceActive) return;
    this.voiceService.speak(text).then(() => {
      this.loop();
    });
  }

  private handleTranscript(text: string): void {
    const cmd = text.toLowerCase();

    switch (this.currentState) {
      case 'BROWSING_CAHIERS':
        this.handleBrowsingCahiers(cmd);
        break;
      case 'BROWSING_NOTES':
        this.handleBrowsingNotes(cmd);
        break;
      case 'DICTATING_TITLE':
        this.handleDictatingTitle(text);
        break;
      case 'DICTATING_CONTENT':
        this.handleDictatingContent(text);
        break;
      case 'READING_NOTE':
        this.handleReadingNote(cmd);
        break;
    }
  }

  private matchIndex(cmd: string, listLength: number): number {
    const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    for (let i = 0; i < listLength; i++) {
      const numStr = (i + 1).toString();
      const wordStr = words[i];
      if (cmd.includes(numStr) || cmd.includes(wordStr)) {
        return i;
      }
    }
    return -1;
  }

  private announceCahiers(): void {
    this.currentState = 'BROWSING_CAHIERS';
    const cahiers = this.api.getCahiers();
    let prompt = `You have ${cahiers.length} notebooks. `;
    cahiers.forEach((c, idx) => {
      prompt += `Notebook ${idx + 1}: ${c.name}. `;
    });
    prompt += `Possible actions: Say "open notebook one" to open a notebook, or say "stop" to exit voice mode.`;
    this.speakAndListen(prompt);
  }

  private handleBrowsingCahiers(cmd: string): void {
    if (cmd.includes('stop') || cmd.includes('exit')) {
      this.voiceService.speak('Voice mode disabled.');
      this.stop();
      return;
    }
    if (cmd.includes('open') || cmd.includes('notebook')) {
      const cahiers = this.api.getCahiers();
      const idx = this.matchIndex(cmd, cahiers.length);
      if (idx !== -1) {
        this.api.openCahier(cahiers[idx].id);
        this.announceNotes(cahiers[idx].name);
        return;
      }
    }
    this.speakAndListen("Command not recognized. Possible actions: Say 'open notebook one', or say 'stop'.");
  }

  private announceNotes(cahierName: string): void {
    this.currentState = 'BROWSING_NOTES';
    setTimeout(() => {
      const notes = this.api.getNotes();
      let prompt = `Opened notebook ${cahierName}. You have ${notes.length} notes here. `;
      notes.forEach((n, idx) => {
        prompt += `Note ${idx + 1}: ${n.title}. `;
      });
      prompt += `Possible actions: Say "read note one" to open a note, say "create new note", or say "back" to return to notebooks.`;
      this.speakAndListen(prompt);
    }, 500); // give UI time to load notes
  }

  private handleBrowsingNotes(cmd: string): void {
    if (cmd.includes('back')) {
      this.api.goBackToCahiers();
      this.announceCahiers();
      return;
    }
    if (cmd.includes('create') || cmd.includes('new')) {
      this.api.startNewNote();
      this.currentState = 'DICTATING_TITLE';
      this.speakAndListen("Creating new note. Possible actions: Simply dictate the new title after the beep.");
      return;
    }
    if (cmd.includes('read') || cmd.includes('open') || cmd.includes('note')) {
      const notes = this.api.getNotes();
      const idx = this.matchIndex(cmd, notes.length);
      if (idx !== -1) {
        this.api.openNote(notes[idx].id);
        this.currentState = 'READING_NOTE';
        setTimeout(() => {
          const content = this.api.getNotes().find(n => n.id === notes[idx].id)?.content;
          this.speakAndListen(`Reading note ${idx + 1}. Title: ${notes[idx].title}. Content: ${content}. Possible actions: Say "back" to return to the note list.`);
        }, 100);
        return;
      }
    }
    this.speakAndListen("Command not recognized. Possible actions: Say 'read note one', say 'create new note', or say 'back'.");
  }

  private handleReadingNote(cmd: string): void {
    if (cmd.includes('back')) {
      this.currentState = 'BROWSING_NOTES';
      this.speakAndListen("Returning to notes list. Possible actions: Say 'read note one', say 'create new note', or say 'back'.");
    } else {
      this.speakAndListen("You are reading a note. Possible actions: Say 'back' to return to the list.");
    }
  }

  private handleDictatingTitle(text: string): void {
      this.api.setNewNoteTitle(text);
      this.currentState = 'DICTATING_CONTENT';
      this.speakAndListen(`Title set to ${text}. Possible actions: Now dictate the content after the beep.`);
  }

  private handleDictatingContent(text: string): void {
      const cmd = text.toLowerCase();
      if (cmd.includes('save') && cmd.includes('note')) {
         this.api.saveNote();
         this.currentState = 'BROWSING_NOTES';
         this.speakAndListen(`Note saved successfully. Possible actions: Say 'read note one', say 'create new note', or say 'back'.`);
         return;
      }
      
      this.api.setNewNoteContent(text);
      this.speakAndListen(`Content recorded. Possible actions: Say "save note" to finish, or dictate again to overwrite your content.`);
  }
}
