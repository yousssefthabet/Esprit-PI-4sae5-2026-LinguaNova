package com.clubs.clubs_service.dto.clubai;

public record ClubHealthMetricsDto(
        int totalMembers,
        int activeMembers,
        int inactiveMembers,
        double engagementRate,
        double attendanceRate,
        double activityCompletionRate,
        double averageLevelProgression,
        double speakingParticipationRate,
        double inactivityRate
) {
}

