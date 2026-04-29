package com.event.event_service.dto.accessibility;

public record SimplifyTextResponse(
        String simplifiedText,
        int originalLength,
        int simplifiedLength
) {
}

