package com.event.event_service.service.accessibility;

import com.event.event_service.dto.accessibility.SpeechToTextResponse;
import org.springframework.web.multipart.MultipartFile;

public interface SpeechToTextService {
    SpeechToTextResponse transcribe(MultipartFile audioFile);
}

