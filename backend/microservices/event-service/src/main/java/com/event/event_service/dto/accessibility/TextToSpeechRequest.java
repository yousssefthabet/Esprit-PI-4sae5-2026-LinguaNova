package com.event.event_service.dto.accessibility;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TextToSpeechRequest(
        @NotBlank(message = "text is required") String text,
        @NotBlank(message = "language is required") String language,
        @NotBlank(message = "voice is required") String voice,
        @NotNull(message = "speechRate is required")
        @DecimalMin(value = "0.5", message = "speechRate must be >= 0.5")
        @DecimalMax(value = "2.0", message = "speechRate must be <= 2.0")
        Double speechRate,
        String userId
) {
}

