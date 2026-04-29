package com.event.event_service.service.accessibility;

import com.event.event_service.dto.accessibility.SpeechToTextResponse;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MockSpeechToTextService implements SpeechToTextService {

    @Override
    public SpeechToTextResponse transcribe(MultipartFile audioFile) {
        if (audioFile == null || audioFile.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "audio file is required");
        }

        String fileName = audioFile.getOriginalFilename() == null ? "audio-input" : audioFile.getOriginalFilename();
        double sizeKb = audioFile.getSize() / 1024.0;
        String text = String.format(
                Locale.ROOT,
                "Mock transcript from %s (%.1f KB): Hello, I need help understanding this learning content.",
                fileName,
                sizeKb
        );

        return new SpeechToTextResponse(
                text,
                "en-US",
                0.92,
                "Mock STT transcription generated"
        );
    }
}

