package com.LinguaNova.note_service.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class NoteImportItemResult {
    boolean success;
    Long noteId;
    String title;
    String sourceUrl;
    String reason;
}
