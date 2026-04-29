package com.event.event_service.dto.accessibility;

public record AccessibilityHelperResponse(
        String action,
        TextToSpeechResponse textToSpeech,
        SpeechToTextResponse speechToText,
        SimplifyTextResponse simplifyText
) {
}

