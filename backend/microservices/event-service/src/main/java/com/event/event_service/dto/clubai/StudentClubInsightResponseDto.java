package com.event.event_service.dto.clubai;

import java.util.List;

public record StudentClubInsightResponseDto(
        String clubId,
        Long studentId,
        String engagementLevel,
        double engagementScore,
        String suggestedNextAction,
        List<String> aiSuggestions,
        int pendingActivities,
        String nextRecommendedSession
) {
}

