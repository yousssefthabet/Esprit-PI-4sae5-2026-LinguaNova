package com.event.event_service.dto.accessibility;

public record SpeechToTextResponse(
        String text,
        String language,
        double confidence,
        String message
) {
}

