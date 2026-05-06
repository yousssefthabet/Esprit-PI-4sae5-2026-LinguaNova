package com.clubs.clubs_service.dto.clubai;

import com.clubs.clubs_service.entity.ActivityDifficulty;
import com.clubs.clubs_service.entity.ClubActivityType;

public record GenerateClubActivityRequestDto(
        ClubActivityType preferredType,
        ActivityDifficulty preferredDifficulty,
        String adminId
) {
}

