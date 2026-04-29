package com.event.event_service.dto.accessibility;

import jakarta.validation.constraints.NotBlank;

public record SimplifyTextRequest(
        @NotBlank(message = "text is required") String text,
        String userId
) {
}

