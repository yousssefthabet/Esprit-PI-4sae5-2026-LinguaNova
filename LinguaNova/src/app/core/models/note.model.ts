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

export interface NoteImportCandidate {
  title: string;
  content: string;
  sourceUrl: string;
  sourceDomain?: string | null;
  sourceTitle?: string | null;
  publishedAt?: string | null;
  fetchedAt: string;
  relevanceScore: number;
  selected: boolean;
}

export interface NoteImportArticlePayload {
  title?: string | null;
  content: string;
  sourceUrl: string;
  sourceDomain?: string | null;
  sourceTitle?: string | null;
  publishedAt?: string | null;
  fetchedAt?: string | null;
}

export interface NoteImportBatchRequest {
  userId: number;
  cahierId: number;
  importQuery: string;
  articles: NoteImportArticlePayload[];
}

export interface NoteImportItemResult {
  success: boolean;
  noteId?: number | null;
  title?: string | null;
  sourceUrl: string;
  reason: string;
}

export interface NoteImportBatchResponse {
  userId: number;
  cahierId: number;
  importQuery: string;
  requestedCount: number;
  createdCount: number;
  results: NoteImportItemResult[];
}
