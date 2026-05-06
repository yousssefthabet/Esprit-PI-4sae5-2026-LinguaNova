package com.clubs.clubs_service.dto.clubai;

import com.clubs.clubs_service.entity.ActivityDifficulty;
import com.clubs.clubs_service.entity.ClubActivityType;
import java.time.LocalDateTime;

public record ClubActivityFeedItemDto(
        Long id,
        String title,
        String description,
        ClubActivityType type,
        ActivityDifficulty difficulty,
        boolean published,
        double completionRate,
        LocalDateTime createdAt
) {
}

