package com.event.event_service.dto.accessibility;

public record TextToSpeechResponse(
        String mimeType,
        String fileName,
        String audioBase64,
        String message
) {
}

