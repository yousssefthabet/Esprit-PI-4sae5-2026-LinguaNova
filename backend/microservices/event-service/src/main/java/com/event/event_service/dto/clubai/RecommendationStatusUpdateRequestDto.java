package com.event.event_service.dto.clubai;

import com.event.event_service.entity.RecommendationStatus;
import jakarta.validation.constraints.NotNull;

public record RecommendationStatusUpdateRequestDto(
        @NotNull RecommendationStatus status,
        String adminId,
        String note
) {
}

