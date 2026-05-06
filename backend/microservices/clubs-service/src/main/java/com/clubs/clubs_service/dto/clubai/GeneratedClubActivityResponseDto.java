package com.clubs.clubs_service.dto.clubai;

import com.clubs.clubs_service.entity.ActivityDifficulty;
import com.clubs.clubs_service.entity.ClubActivityType;
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

