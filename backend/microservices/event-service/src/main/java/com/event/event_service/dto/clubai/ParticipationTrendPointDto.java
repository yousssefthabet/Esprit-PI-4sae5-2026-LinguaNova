package com.event.event_service.dto.clubai;

public record ParticipationTrendPointDto(
        String date,
        double attendanceRate,
        double speakingParticipationRate,
        double engagementIndex
) {
}

