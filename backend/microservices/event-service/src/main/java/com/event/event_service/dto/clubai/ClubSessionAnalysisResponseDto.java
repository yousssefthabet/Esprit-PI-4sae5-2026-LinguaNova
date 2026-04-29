package com.event.event_service.dto.clubai;

import java.time.LocalDateTime;
import java.util.List;

public record ClubSessionAnalysisResponseDto(
        String clubId,
        String clubTitle,
        double healthScore,
        String scoreInterpretation,
        ClubHealthMetricsDto metrics,
        List<String> detectedProblems,
        String summarySentence,
        LocalDateTime analyzedAt
) {
}

