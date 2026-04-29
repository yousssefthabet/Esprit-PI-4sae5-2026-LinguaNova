package com.event.event_service.service.accessibility;

import com.event.event_service.dto.accessibility.TextToSpeechResponse;

public interface TextToSpeechService {
    TextToSpeechResponse synthesize(String text, String language, String voice, double speechRate);
}

