package com.clubs.clubs_service.service.clubai;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.clubs.clubs_service.dto.clubai.ClubHealthMetricsDto;
import com.clubs.clubs_service.dto.clubai.ParticipationTrendPointDto;
import com.clubs.clubs_service.entity.ActivityDifficulty;
import com.clubs.clubs_service.entity.ClubActivityType;
import com.clubs.clubs_service.entity.RecommendationPriority;
import java.util.List;
import org.junit.jupiter.api.Test;

class RuleBasedClubAiEngineServiceTest {

    private final RuleBasedClubAiEngineService engine = new RuleBasedClubAiEngineService();

    @Test
    void computeHealthScore_shouldClampAndRoundWeightedScore() {
        ClubHealthMetricsDto metrics = new ClubHealthMetricsDto(100, 80, 20, 80, 70, 60, 2.0, 50, 10);

        double score = engine.computeHealthScore(metrics);

        assertEquals(62.8, score);
        assertEquals("Club performance is moderate and needs targeted intervention.", engine.interpretScore(score));
    }

    @Test
    void detectIssues_shouldReportWeakIndicators() {
        ClubHealthMetricsDto metrics = new ClubHealthMetricsDto(100, 40, 60, 40, 45, 50, 1.0, 25, 40);

        List<String> issues = engine.detectIssues(metrics);

        assertEquals(6, issues.size());
        assertTrue(issues.get(0).contains("Low engagement"));
    }

    @Test
    void buildRecommendations_shouldAddActionsForLowSpeakingAndInactivity() {
        ClubHealthMetricsDto metrics = new ClubHealthMetricsDto(100, 70, 30, 70, 70, 70, 2.0, 20, 45);

        List<RuleBasedClubAiEngineService.RecommendationBlueprint> recommendations =
                engine.buildRecommendations(metrics, engine.detectIssues(metrics));

        assertEquals(2, recommendations.size());
        assertEquals(RecommendationPriority.HIGH, recommendations.get(0).priority());
    }

    @Test
    void generateActivityBlueprint_shouldUseDefaultsWhenPreferencesAreMissing() {
        RuleBasedClubAiEngineService.ActivityBlueprint activity =
                engine.generateActivityBlueprint("English Club", null, null);

        assertEquals(ClubActivityType.DISCUSSION_TOPIC, activity.type());
        assertEquals(ActivityDifficulty.INTERMEDIATE, activity.difficulty());
        assertFalse(activity.title().isBlank());
    }

    @Test
    void buildTrendSummary_shouldDetectImprovingTrend() {
        String summary = engine.buildTrendSummary(List.of(
                new ParticipationTrendPointDto("2026-05-01", 50, 50, 50),
                new ParticipationTrendPointDto("2026-05-08", 60, 60, 60)
        ));

        assertEquals("Participation trend is improving steadily.", summary);
    }
}
