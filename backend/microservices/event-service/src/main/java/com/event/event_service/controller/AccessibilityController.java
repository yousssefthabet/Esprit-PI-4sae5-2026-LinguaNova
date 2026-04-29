package com.event.event_service.controller;

import com.event.event_service.dto.accessibility.AccessibilityHelperResponse;
import com.event.event_service.dto.accessibility.SimplifyTextRequest;
import com.event.event_service.dto.accessibility.SimplifyTextResponse;
import com.event.event_service.dto.accessibility.SpeechToTextResponse;
import com.event.event_service.dto.accessibility.TextToSpeechRequest;
import com.event.event_service.dto.accessibility.TextToSpeechResponse;
import com.event.event_service.entity.AccessibilityActionType;
import com.event.event_service.service.accessibility.AccessibilityHistoryService;
import com.event.event_service.service.accessibility.SpeechToTextService;
import com.event.event_service.service.accessibility.TextSimplificationService;
import com.event.event_service.service.accessibility.TextToSpeechService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping({"/api/ai/accessibility", "/api/events/accessibility"})
@RequiredArgsConstructor
public class AccessibilityController {

    private final TextToSpeechService textToSpeechService;
    private final SpeechToTextService speechToTextService;
    private final TextSimplificationService textSimplificationService;
    private final AccessibilityHistoryService accessibilityHistoryService;

    @PostMapping("/text-to-speech")
    public ResponseEntity<TextToSpeechResponse> textToSpeech(@Valid @RequestBody TextToSpeechRequest request) {
        TextToSpeechResponse response = textToSpeechService.synthesize(
                request.text(),
                request.language(),
                request.voice(),
                request.speechRate()
        );

        accessibilityHistoryService.record(
                request.userId(),
                AccessibilityActionType.TTS,
                request.text(),
                response.message()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/speech-to-text", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SpeechToTextResponse> speechToText(
            @RequestPart("audio") MultipartFile audioFile,
            @RequestParam(value = "userId", required = false) String userId
    ) {
        SpeechToTextResponse response = speechToTextService.transcribe(audioFile);

        accessibilityHistoryService.record(
                userId,
                AccessibilityActionType.STT,
                buildAudioInputSummary(audioFile),
                response.text()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/simplify-text")
    public ResponseEntity<SimplifyTextResponse> simplifyText(@Valid @RequestBody SimplifyTextRequest request) {
        String simplified = textSimplificationService.simplify(request.text());
        SimplifyTextResponse response = new SimplifyTextResponse(simplified, request.text().length(), simplified.length());

        accessibilityHistoryService.record(
                request.userId(),
                AccessibilityActionType.SIMPLIFY,
                request.text(),
                simplified
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/helper", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AccessibilityHelperResponse> helper(
            @RequestParam("action") String action,
            @RequestParam(value = "text", required = false) String text,
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "voice", required = false) String voice,
            @RequestParam(value = "speechRate", required = false) Double speechRate,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestPart(value = "audio", required = false) MultipartFile audioFile
    ) {
        String normalizedAction = normalizeAction(action);

        return switch (normalizedAction) {
            case "tts" -> {
                String validatedText = requireText(text, "text");
                TextToSpeechResponse ttsResponse = textToSpeechService.synthesize(
                        validatedText,
                        defaultIfBlank(language, "en-US"),
                        defaultIfBlank(voice, "alloy"),
                        normalizeSpeechRate(speechRate)
                );
                accessibilityHistoryService.record(userId, AccessibilityActionType.TTS, validatedText, ttsResponse.message());
                yield ResponseEntity.ok(new AccessibilityHelperResponse("tts", ttsResponse, null, null));
            }
            case "stt" -> {
                if (audioFile == null || audioFile.isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "audio file is required for stt");
                }
                SpeechToTextResponse sttResponse = speechToTextService.transcribe(audioFile);
                accessibilityHistoryService.record(
                        userId,
                        AccessibilityActionType.STT,
                        buildAudioInputSummary(audioFile),
                        sttResponse.text()
                );
                yield ResponseEntity.ok(new AccessibilityHelperResponse("stt", null, sttResponse, null));
            }
            case "simplify" -> {
                String validatedText = requireText(text, "text");
                String simplified = textSimplificationService.simplify(validatedText);
                SimplifyTextResponse simplifyResponse = new SimplifyTextResponse(
                        simplified,
                        validatedText.length(),
                        simplified.length()
                );
                accessibilityHistoryService.record(
                        userId,
                        AccessibilityActionType.SIMPLIFY,
                        validatedText,
                        simplified
                );
                yield ResponseEntity.ok(new AccessibilityHelperResponse("simplify", null, null, simplifyResponse));
            }
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "action must be one of: tts, stt, simplify"
            );
        };
    }

    private String requireText(String value, String fieldName) {
        String trimmed = value == null ? "" : value.trim();
        if (trimmed.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " is required");
        }
        return trimmed;
    }

    private String buildAudioInputSummary(MultipartFile audioFile) {
        String fileName = audioFile.getOriginalFilename() == null ? "audio-input" : audioFile.getOriginalFilename();
        return fileName + " (" + audioFile.getSize() + " bytes)";
    }

    private String normalizeAction(String action) {
        if (action == null) {
            return "";
        }
        return action.trim().toLowerCase();
    }

    private String defaultIfBlank(String value, String defaultValue) {
        String trimmed = value == null ? "" : value.trim();
        return trimmed.isBlank() ? defaultValue : trimmed;
    }

    private double normalizeSpeechRate(Double speechRate) {
        if (speechRate == null) {
            return 1.0;
        }
        if (speechRate < 0.5 || speechRate > 2.0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "speechRate must be between 0.5 and 2.0");
        }
        return speechRate;
    }
}
