package com.event.event_service.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class AccessibilityControllerTest {

    @Mock
    private TextToSpeechService textToSpeechService;

    @Mock
    private SpeechToTextService speechToTextService;

    @Mock
    private TextSimplificationService textSimplificationService;

    @Mock
    private AccessibilityHistoryService accessibilityHistoryService;

    @InjectMocks
    private AccessibilityController accessibilityController;

    @Test
    void textToSpeech_shouldReturnResponseAndStoreHistory() {
        TextToSpeechRequest request = new TextToSpeechRequest(
                "Hello world",
                "en-US",
                "alloy",
                1.0,
                "42"
        );
        TextToSpeechResponse expected = new TextToSpeechResponse(
                "audio/wav",
                "mock.wav",
                "AAA",
                "Mock generated"
        );
        when(textToSpeechService.synthesize("Hello world", "en-US", "alloy", 1.0)).thenReturn(expected);

        ResponseEntity<TextToSpeechResponse> response = accessibilityController.textToSpeech(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, response.getBody());
        verify(accessibilityHistoryService).record("42", AccessibilityActionType.TTS, "Hello world", "Mock generated");
    }

    @Test
    void speechToText_shouldReturnTranscriptionAndStoreHistory() {
        MockMultipartFile audio = new MockMultipartFile("audio", "voice.wav", "audio/wav", new byte[] {1, 2, 3});
        SpeechToTextResponse expected = new SpeechToTextResponse("mock transcript", "en-US", 0.91, "ok");
        when(speechToTextService.transcribe(audio)).thenReturn(expected);

        ResponseEntity<SpeechToTextResponse> response = accessibilityController.speechToText(audio, "7");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, response.getBody());
        verify(accessibilityHistoryService).record(eq("7"), eq(AccessibilityActionType.STT), eq("voice.wav (3 bytes)"), eq("mock transcript"));
    }

    @Test
    void simplifyText_shouldReturnSimplifiedVersionAndStoreHistory() {
        SimplifyTextRequest request = new SimplifyTextRequest("We should utilize complex words.", "9");
        when(textSimplificationService.simplify("We should utilize complex words.")).thenReturn("We should use easy words.");

        ResponseEntity<SimplifyTextResponse> response = accessibilityController.simplifyText(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("We should use easy words.", response.getBody().simplifiedText());
        verify(accessibilityHistoryService).record(
                "9",
                AccessibilityActionType.SIMPLIFY,
                "We should utilize complex words.",
                "We should use easy words."
        );
    }

    @Test
    void helper_shouldRouteTtsAction() {
        TextToSpeechResponse ttsResponse = new TextToSpeechResponse("audio/wav", "mock.wav", "AAA", "mock");
        when(textToSpeechService.synthesize("Hello", "en-US", "alloy", 1.0)).thenReturn(ttsResponse);

        ResponseEntity<AccessibilityHelperResponse> response = accessibilityController.helper(
                "tts",
                "Hello",
                null,
                null,
                null,
                "12",
                null
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("tts", response.getBody().action());
        assertEquals(ttsResponse, response.getBody().textToSpeech());
    }

    @Test
    void helper_shouldRejectUnknownAction() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> accessibilityController.helper("unknown", null, null, null, null, null, null)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }
}

