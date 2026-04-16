package com.LinguaNova.note_service.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class AttachmentResponse {
    Long id;
    String fileName;
    String contentType;
    Long size;
    Long uploadedBy;
    LocalDateTime uploadedAt;
}

