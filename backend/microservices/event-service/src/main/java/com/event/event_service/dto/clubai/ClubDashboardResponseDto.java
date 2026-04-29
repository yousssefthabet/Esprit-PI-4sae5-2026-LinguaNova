package com.event.event_service.dto.clubai;

import java.util.List;

public record ClubDashboardResponseDto(
        String clubId,
        String clubTitle,
        double healthScore,
        String scoreInterpretation,
        ClubHealthMetricsDto metrics,
        List<String> detectedIssues,
        List<ClubRecommendationDto> recommendations,
        List<ParticipationTrendPointDto> participationTrends,
        String trendSummary,
        String summarySentence,
        List<RecommendationActionHistoryDto> recentActionHistory
) {
}

