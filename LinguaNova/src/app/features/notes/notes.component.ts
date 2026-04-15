import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { NoteService } from '../../core/services/note.service';
import { CahierService } from '../../core/services/cahier.service';
import { AuthService } from '../../core/services/auth.service';
import { NotesVoiceService, NotesVoiceApi } from '../../core/services/notes-voice.service';
import type { Note } from '../../core/models/note.model';
import type { Cahier } from '../../core/models/cahier.model';
import type { NoteContextType } from '../../core/models/note-context-type';

type NotesTab = 'ALL' | NoteContextType;

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent implements OnInit {
  userId = computed(() => {
    const currentUser = this.authService.currentUserValue;
    const currentUserId = currentUser && currentUser.id ? Number(currentUser.id) : NaN;
    return Number.isNaN(currentUserId) ? null : currentUserId;
  });

  activeTab = signal<NotesTab>('ALL');

  cahiers = signal<Cahier[]>([]);
  cahiersLoading = signal(false);
  activeCahierId = signal<number | null>(null);
  activeCahier = computed(() => this.cahiers().find((c) => c.idCahier === this.activeCahierId()));

  notes = signal<Note[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  selectedId = signal<number | null>(null);
  editorTitle = signal<string>('');
  editorContent = signal<string>('');
  editorCahierId = signal<number | null>(null);
  saving = signal(false);
  deleting = signal(false);
  
  uploadingAttachment = signal(false);
  deletingAttachment = signal<number | null>(null);

  // UI helpers for modern design
  getCahierGradient(type: string): string {
    switch (type) {
      case 'COURSE': return 'from-cyan-500 to-blue-600 shadow-blue-500/30';
      case 'EXAM': return 'from-rose-500 to-orange-600 shadow-rose-500/30';
      case 'QUIZ': return 'from-emerald-400 to-teal-600 shadow-emerald-500/30';
      default: return 'from-gray-500 to-slate-700 shadow-gray-500/30';
    }
  }
  
  getCahierBadge(type: string): string {
    switch (type) {
      case 'COURSE': return 'bg-blue-400/20 text-blue-100 border-blue-400/30';
      case 'EXAM': return 'bg-rose-400/20 text-rose-100 border-rose-400/30';
      case 'QUIZ': return 'bg-emerald-400/20 text-emerald-100 border-emerald-400/30';
      default: return 'bg-slate-400/20 text-slate-100 border-slate-400/30';
    }
  }

  newCahierMode = signal(false);
  newCahierName = signal('');
  newCahierType = signal<NoteContextType>('COURSE');
  creatingCahier = signal(false);

  filteredCahiers = computed(() => {
    const tab = this.activeTab();
    if (tab === 'ALL') return this.cahiers();
    return this.cahiers().filter((c) => c.contextType === tab);
  });

  filteredNotes = computed(() => {
    return this.notes();
  });

  selected = computed(() => {
    const id = this.selectedId();
    return id ? this.notes().find((n) => n.id === id) ?? null : null;
  });

  constructor(
    private noteService: NoteService,
    private cahierService: CahierService,
    private authService: AuthService,
    public notesVoiceService: NotesVoiceService
  ) {}

  ngOnInit(): void {
    this.reloadCahiers();
  }

  setActiveTab(tab: NotesTab): void {
    this.activeTab.set(tab);
    this.activeCahierId.set(null);
  }

  reloadCahiers(): void {
    const userId = this.userId();
    if (!userId) {
      this.cahiers.set([]);
      this.notes.set([]);
      return;
    }
    this.cahiersLoading.set(true);
    this.cahierService.list(userId).subscribe({
      next: (list) => {
        this.cahiers.set(list);
        this.cahiersLoading.set(false);
      },
      error: () => {
        this.cahiersLoading.set(false);
        this.error.set("Impossible de charger les cahiers.");
      }
    });
  }

  openCahier(cahierId: number): void {
    this.activeCahierId.set(cahierId);
    this.openNewNote();
    this.reloadNotes();
  }

  closeCahier(): void {
    this.activeCahierId.set(null);
    this.notes.set([]);
  }

  createCahier(): void {
    const userId = this.userId();
    const nom = this.newCahierName().trim();
    if (!userId || !nom) return;

    this.creatingCahier.set(true);
    this.cahierService.create({ userId, nomContexte: nom, contextType: this.newCahierType() }).subscribe({
      next: (cahier) => {
        this.creatingCahier.set(false);
        this.newCahierMode.set(false);
        this.newCahierName.set('');
        this.reloadCahiers();
      },
      error: () => {
        this.creatingCahier.set(false);
        this.error.set("Erreur lors de la création du cahier.");
      }
    });
  }

  deleteCahier(id: number): void {
    if (!confirm('Supprimer ce cahier et TOUTES ses notes ?')) return;
    this.cahierService.delete(id).subscribe({
      next: () => {
        if (this.activeCahierId() === id) {
          this.closeCahier();
        }
        this.reloadCahiers();
      },
      error: () => this.error.set('Erreur suppression cahier.')
    });
  }

  reloadNotes(): void {
    const userId = this.userId();
    const cahierId = this.activeCahierId();
    if (!userId || !cahierId) return;

    this.loading.set(true);
    this.noteService.getByCahier(userId, cahierId).pipe(map((list: Note[]) => list || [])).subscribe({
      next: (list: Note[]) => {
        this.notes.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les notes.');
        this.loading.set(false);
      },
    });
  }

  openNewNote(): void {
    this.selectedId.set(null);
    this.editorTitle.set('');
    this.editorContent.set('');
    this.editorCahierId.set(this.activeCahierId());
  }

  openNote(n: Note): void {
    this.selectedId.set(n.id);
    this.editorTitle.set(n.title ?? '');
    this.editorContent.set(n.content);
    this.editorCahierId.set(n.cahierId);
  }

  saveNote(): void {
    const userId = this.userId();
    const cahierId = this.editorCahierId();
    const content = this.editorContent().trim();

    if (!userId) { this.error.set('Utilisateur non connecté.'); return; }
    if (!content) { this.error.set('Le contenu ne peut pas être vide.'); return; }
    if (!cahierId) { this.error.set("Cahier non défini."); return; }

    this.saving.set(true);
    this.error.set(null);
    const title = this.editorTitle().trim();

    const id = this.selectedId();
    const req$ = id
      ? this.noteService.update(id, { title: title || 'Sans titre', content, cahierId })
      : this.noteService.create({ title: title || 'Sans titre', content, userId, cahierId });

    req$.subscribe({
      next: (saved: Note) => {
        this.saving.set(false);
        if (saved.cahierId !== this.activeCahierId()) {
          this.openNewNote(); // Hide if moved away
        } else {
          this.selectedId.set(saved.id);
        }
        this.reloadNotes();
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.error.set("Erreur lors de l'enregistrement.");
      },
    });
  }

  deleteSelectedNote(): void {
    const id = this.selectedId();
    if (!id) return;
    if (!confirm('Supprimer cette note ?')) return;
    this.deleting.set(true);
    this.noteService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.openNewNote();
        this.reloadNotes();
      },
      error: () => {
        this.deleting.set(false);
      },
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const noteId = this.selectedId();
    const currentUser = this.authService.currentUserValue;
    const userId = Number(currentUser?.id);

    if (!noteId || Number.isNaN(userId)) return;

    this.uploadingAttachment.set(true);
    this.noteService.uploadAttachment(noteId, file, userId).subscribe({
        next: () => {
            this.uploadingAttachment.set(false);
            this.reloadNotes();
            input.value = '';
        },
        error: () => {
            this.uploadingAttachment.set(false);
            this.error.set("Erreur lors de l'envoi de la pièce jointe.");
            input.value = '';
        }
    });
  }

  downloadAttachment(id: number, fileName: string): void {
      this.noteService.downloadAttachment(id).subscribe({
          next: (blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
          },
          error: () => this.error.set('Erreur de téléchargement.')
      });
  }

  deleteAttachment(id: number): void {
      if (!confirm('Supprimer cette pièce jointe ?')) return;
      this.deletingAttachment.set(id);
      this.noteService.deleteAttachment(id).subscribe({
          next: () => {
              this.deletingAttachment.set(null);
              this.reloadNotes();
          },
          error: () => {
              this.deletingAttachment.set(null);
              this.error.set('Erreur suppression pièce jointe.');
          }
      });
  }

  toggleVoiceMode(): void {
    if (this.notesVoiceService.isActive()) {
      this.notesVoiceService.stop();
    } else {
      const api: NotesVoiceApi = {
        getCahiers: () => this.cahiers().map(c => ({ name: c.nomContexte, id: c.idCahier! })),
        getNotes: () => this.notes().map(n => ({ title: n.title ?? 'Sans titre', content: n.content, id: n.id! })),
        openCahier: (id: number) => this.openCahier(id),
        openNote: (id: number) => {
          const n = this.notes().find(x => x.id === id);
          if (n) this.openNote(n);
        },
        goBackToCahiers: () => this.closeCahier(),
        startNewNote: () => this.openNewNote(),
        setNewNoteTitle: (title: string) => this.editorTitle.set(title),
        setNewNoteContent: (content: string) => this.editorContent.set(content),
        saveNote: () => this.saveNote()
      };
      this.notesVoiceService.start(api);
    }
  }
}
