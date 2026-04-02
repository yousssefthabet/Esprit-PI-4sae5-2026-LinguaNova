import type { NoteContextType } from './note-context-type';

export interface Note {
  id: number;
  title?: string | null;
  content: string;
  cahierId: number;
  cahierNom?: string;
  contextType: NoteContextType;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
  attachments?: AttachmentResponse[];
}

export interface AttachmentResponse {
  id: number;
  fileName: string;
  contentType: string;
  size: number;
  uploadedBy: number;
  uploadedAt: string;
}

export interface NoteCreateRequest {
  title?: string | null;
  content: string;
  userId: number;
  cahierId: number;
}

export interface NoteUpdateRequest {
  title?: string | null;
  content: string;
  cahierId?: number;
}
