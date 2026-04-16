package com.LinguaNova.note_service.dto;

import com.LinguaNova.note_service.entity.NoteContextType;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;
import java.util.List;

@Value
@Builder
public class NoteResponse {
    Long id;
    String title;
    String content;
    Long cahierId;
    String cahierNom;
    NoteContextType contextType;
    Long userId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<AttachmentResponse> attachments;
}

