package com.event.event_service.dto.clubai;

import com.event.event_service.entity.ActivityDifficulty;
import com.event.event_service.entity.ClubActivityType;
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

