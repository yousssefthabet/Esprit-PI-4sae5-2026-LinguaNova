package com.clubs.clubs_service.dto.clubai;

import java.util.List;

public record ClubEngagementResponseDto(
        String clubId,
        String clubTitle,
        int activeMembersCount,
        int inactiveMembersCount,
        double engagementRate,
        List<ParticipationTrendPointDto> participationTrends,
        String trendSummary
) {
}

