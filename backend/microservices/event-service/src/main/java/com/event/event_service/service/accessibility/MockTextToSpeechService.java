package com.event.event_service.service.accessibility;

import com.event.event_service.dto.accessibility.TextToSpeechResponse;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import org.springframework.stereotype.Service;

@Service
public class MockTextToSpeechService implements TextToSpeechService {

    private static final int SAMPLE_RATE = 16_000;
    private static final int CHANNELS = 1;
    private static final int BITS_PER_SAMPLE = 16;
    private static final double MIN_DURATION_SECONDS = 1.0;
    private static final double MAX_DURATION_SECONDS = 6.0;
    private static final DateTimeFormatter FILE_TS = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    @Override
    public TextToSpeechResponse synthesize(String text, String language, String voice, double speechRate) {
        String normalizedText = normalizeText(text);
        double normalizedRate = clamp(speechRate, 0.5, 2.0);
        double durationSeconds = clamp(normalizedText.length() / (26.0 * normalizedRate), MIN_DURATION_SECONDS, MAX_DURATION_SECONDS);

        byte[] wavBytes = buildWavTone(durationSeconds, normalizedRate);
        String audioBase64 = Base64.getEncoder().encodeToString(wavBytes);
        String fileName = "mock-tts-" + LocalDateTime.now().format(FILE_TS) + ".wav";

        return new TextToSpeechResponse(
                "audio/wav",
                fileName,
                audioBase64,
                "Mock TTS audio generated for language=" + language + ", voice=" + voice + ", rate=" + normalizedRate
        );
    }

    private byte[] buildWavTone(double durationSeconds, double speechRate) {
        int sampleCount = Math.max(1, (int) (SAMPLE_RATE * durationSeconds));
        int bytesPerSample = BITS_PER_SAMPLE / 8;
        int dataSize = sampleCount * CHANNELS * bytesPerSample;
        int fileSizeMinus8 = 36 + dataSize;

        ByteBuffer buffer = ByteBuffer.allocate(44 + dataSize).order(ByteOrder.LITTLE_ENDIAN);
        buffer.put((byte) 'R').put((byte) 'I').put((byte) 'F').put((byte) 'F');
        buffer.putInt(fileSizeMinus8);
        buffer.put((byte) 'W').put((byte) 'A').put((byte) 'V').put((byte) 'E');
        buffer.put((byte) 'f').put((byte) 'm').put((byte) 't').put((byte) ' ');
        buffer.putInt(16);
        buffer.putShort((short) 1);
        buffer.putShort((short) CHANNELS);
        buffer.putInt(SAMPLE_RATE);
        buffer.putInt(SAMPLE_RATE * CHANNELS * bytesPerSample);
        buffer.putShort((short) (CHANNELS * bytesPerSample));
        buffer.putShort((short) BITS_PER_SAMPLE);
        buffer.put((byte) 'd').put((byte) 'a').put((byte) 't').put((byte) 'a');
        buffer.putInt(dataSize);

        double baseFrequency = 440.0;
        double frequency = baseFrequency * clamp(speechRate, 0.5, 2.0);
        double amplitude = Short.MAX_VALUE * 0.25;

        for (int i = 0; i < sampleCount; i++) {
            double t = (double) i / SAMPLE_RATE;
            short sample = (short) (Math.sin(2.0 * Math.PI * frequency * t) * amplitude);
            buffer.putShort(sample);
        }
        return buffer.array();
    }

    private String normalizeText(String text) {
        if (text == null) {
            return "";
        }
        return text.trim().replaceAll("\\s+", " ");
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}

