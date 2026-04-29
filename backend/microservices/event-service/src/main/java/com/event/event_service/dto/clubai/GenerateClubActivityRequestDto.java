package com.event.event_service.dto.clubai;

import com.event.event_service.entity.ActivityDifficulty;
import com.event.event_service.entity.ClubActivityType;

public record GenerateClubActivityRequestDto(
        ClubActivityType preferredType,
        ActivityDifficulty preferredDifficulty,
        String adminId
) {
}

