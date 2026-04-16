package com.LinguaNova.note_service.dto;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class NoteImportBatchResponse {
    Long userId;
    Long cahierId;
    String importQuery;
    int requestedCount;
    int createdCount;
    List<NoteImportItemResult> results;
}
