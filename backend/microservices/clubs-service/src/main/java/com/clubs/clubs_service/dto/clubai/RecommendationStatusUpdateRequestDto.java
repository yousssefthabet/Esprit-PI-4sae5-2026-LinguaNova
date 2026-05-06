package com.clubs.clubs_service.dto.clubai;

import com.clubs.clubs_service.entity.RecommendationStatus;
import jakarta.validation.constraints.NotNull;

public record RecommendationStatusUpdateRequestDto(
        @NotNull RecommendationStatus status,
        String adminId,
        String note
) {
}

