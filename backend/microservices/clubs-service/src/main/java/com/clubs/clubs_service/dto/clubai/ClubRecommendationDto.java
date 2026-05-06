package com.clubs.clubs_service.dto.clubai;

import com.clubs.clubs_service.entity.RecommendationPriority;
import com.clubs.clubs_service.entity.RecommendationStatus;
import java.time.LocalDateTime;

public record ClubRecommendationDto(
        Long id,
        String title,
        String description,
        RecommendationPriority priority,
        RecommendationStatus status,
        String reasoning,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

