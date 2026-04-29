package com.event.event_service.dto.clubai;

import com.event.event_service.entity.ActivityDifficulty;
import com.event.event_service.entity.ClubActivityType;
import java.time.LocalDateTime;

public record GeneratedClubActivityResponseDto(
        Long activityId,
        String title,
        String description,
        ActivityDifficulty difficulty,
        ClubActivityType suggestedType,
        boolean published,
        LocalDateTime createdAt
) {
}

