package com.clubs.clubs_service.dto.clubai;

public record ParticipationTrendPointDto(
        String date,
        double attendanceRate,
        double speakingParticipationRate,
        double engagementIndex
) {
}

