package com.event.event_service.dto.clubai;

import com.event.event_service.entity.RecommendationPriority;
import com.event.event_service.entity.RecommendationStatus;
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

