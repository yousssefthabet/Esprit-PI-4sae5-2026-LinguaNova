package com.clubs.clubs_service.dto.clubai;

import com.clubs.clubs_service.entity.RecommendationStatus;
import java.time.LocalDateTime;

public record RecommendationActionHistoryDto(
        Long recommendationId,
        RecommendationStatus status,
        String adminId,
        String note,
        LocalDateTime actedAt
) {
}

