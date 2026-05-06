package com.clubs.clubs_service.service.clubai;

import com.clubs.clubs_service.dto.clubai.ClubHealthMetricsDto;
import com.clubs.clubs_service.dto.clubai.ParticipationTrendPointDto;
import com.clubs.clubs_service.entity.ActivityDifficulty;
import com.clubs.clubs_service.entity.ClubActivityType;
import com.clubs.clubs_service.entity.RecommendationPriority;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class RuleBasedClubAiEngineService {

    public double computeHealthScore(ClubHealthMetricsDto metrics) {
        double progressionScore = clamp(metrics.averageLevelProgression() * 20.0, 0, 100);
        double score = 0.30 * metrics.engagementRate()
                + 0.22 * metrics.attendanceRate()
                + 0.20 * metrics.activityCompletionRate()
                + 0.16 * progressionScore
                + 0.12 * metrics.speakingParticipationRate()
                - 0.10 * metrics.inactivityRate();
        return round(clamp(score, 0, 100));
    }

    public String interpretScore(double healthScore) {
        if (healthScore >= 85) {
            return "Club performance is excellent and highly sustainable.";
        }
        if (healthScore >= 70) {
            return "Club performance is healthy with a few areas to optimize.";
        }
        if (healthScore >= 55) {
            return "Club performance is moderate and needs targeted intervention.";
        }
        return "Club performance is at risk and requires immediate action.";
    }

    public List<String> detectIssues(ClubHealthMetricsDto metrics) {
        List<String> issues = new ArrayList<>();
        if (metrics.engagementRate() < 55) {
            issues.add("Low engagement rate across club members.");
        }
        if (metrics.attendanceRate() < 50) {
            issues.add("Low attendance rate in recent sessions.");
        }
        if (metrics.activityCompletionRate() < 55) {
            issues.add("Low activity completion rate.");
        }
        if (metrics.averageLevelProgression() < 1.2) {
            issues.add("Weak average level progression.");
        }
        if (metrics.speakingParticipationRate() < 40) {
            issues.add("Low speaking participation.");
        }
        if (metrics.inactivityRate() > 35) {
            issues.add("High inactivity rate among enrolled members.");
        }
        return issues;
    }

    public String buildSummarySentence(ClubHealthMetricsDto metrics, double healthScore, List<String> issues) {
        if (issues.isEmpty()) {
            return "Club participation is stable and learning progression is on track.";
        }

        if (metrics.speakingParticipationRate() < 40 && metrics.engagementRate() >= 60) {
            return "Club participation is stable but speaking activity is low.";
        }
        if (metrics.attendanceRate() < 50 && metrics.engagementRate() < 60) {
            return "Many students are enrolled but only a small percentage attend sessions regularly.";
        }
        if (metrics.activityCompletionRate() >= 65 && metrics.averageLevelProgression() < 1.2) {
            return "The club shows good completion rates but weak progression in speaking skills.";
        }
        if (healthScore < 55) {
            return "Participation and learning indicators are declining and require urgent admin action.";
        }
        return "Club health is mixed; targeted actions can quickly improve outcomes.";
    }

    public String buildTrendSummary(List<ParticipationTrendPointDto> trends) {
        if (trends == null || trends.size() < 2) {
            return "Not enough trend data to determine direction.";
        }
        double first = trends.get(0).engagementIndex();
        double last = trends.get(trends.size() - 1).engagementIndex();
        double delta = last - first;
        if (delta >= 6) {
            return "Participation trend is improving steadily.";
        }
        if (delta <= -6) {
            return "Participation trend is declining and should be monitored.";
        }
        return "Participation trend is mostly stable.";
    }

    public List<RecommendationBlueprint> buildRecommendations(ClubHealthMetricsDto metrics, List<String> issues) {
        List<RecommendationBlueprint> drafts = new ArrayList<>();

        if (metrics.speakingParticipationRate() < 40) {
            drafts.add(new RecommendationBlueprint(
                    "Schedule a live speaking session",
                    "Introduce a weekly live speaking room with peer role-play and moderator prompts.",
                    RecommendationPriority.HIGH,
                    "Speaking participation is below target."
            ));
        }
        if (metrics.activityCompletionRate() < 55) {
            drafts.add(new RecommendationBlueprint(
                    "Publish easier activity content",
                    "Create beginner-friendly activities and split long exercises into mini challenges.",
                    RecommendationPriority.HIGH,
                    "Completion rate is low."
            ));
        }
        if (metrics.inactivityRate() > 35) {
            drafts.add(new RecommendationBlueprint(
                    "Re-engage inactive students",
                    "Send reminders to inactive members and invite them to the next live session.",
                    RecommendationPriority.HIGH,
                    "Inactivity is above acceptable threshold."
            ));
        }
        if (metrics.attendanceRate() < 50) {
            drafts.add(new RecommendationBlueprint(
                    "Optimize session schedule",
                    "Test alternative session times and add reminder notifications 24h before start.",
                    RecommendationPriority.MEDIUM,
                    "Attendance rate is weak."
            ));
        }
        if (metrics.averageLevelProgression() < 1.2) {
            drafts.add(new RecommendationBlueprint(
                    "Launch a weekly vocabulary challenge",
                    "Publish a weekly vocabulary challenge with short collaborative tasks.",
                    RecommendationPriority.MEDIUM,
                    "Progression score is below baseline."
            ));
        }
        if (drafts.isEmpty() && issues.isEmpty()) {
            drafts.add(new RecommendationBlueprint(
                    "Maintain current strategy",
                    "Club indicators are healthy. Keep cadence and continue tracking participation quality.",
                    RecommendationPriority.LOW,
                    "All key indicators are in healthy range."
            ));
        }
        return drafts;
    }

    public ActivityBlueprint generateActivityBlueprint(
            String clubTitle,
            ClubActivityType preferredType,
            ActivityDifficulty preferredDifficulty
    ) {
        ClubActivityType type = preferredType == null ? ClubActivityType.DISCUSSION_TOPIC : preferredType;
        ActivityDifficulty difficulty = preferredDifficulty == null ? ActivityDifficulty.INTERMEDIATE : preferredDifficulty;

        String normalizedClubName = (clubTitle == null ? "Club" : clubTitle).trim();
        String title;
        String description;

        switch (type) {
            case ROLE_PLAY_PROMPT -> {
                title = "Role-play Sprint: Real-life Interaction";
                description = "Students pair up and perform short speaking role-plays linked to " + normalizedClubName
                        + ". Rotate roles every 3 minutes and provide peer feedback.";
            }
            case VOCABULARY_GAME -> {
                title = "Vocabulary Relay Challenge";
                description = "Teams complete quick vocabulary missions and build context-rich example sentences."
                        + " Include one collaborative mini-quiz at the end.";
            }
            case MINI_CHALLENGE -> {
                title = "7-Minute Club Mini Challenge";
                description = "Members solve a short collaborative challenge with clear success criteria and share outcomes"
                        + " in the club feed.";
            }
            default -> {
                title = "Guided Discussion Circle";
                description = "Launch a guided discussion topic with 3 open-ended prompts and a peer reflection task.";
            }
        }

        if (difficulty == ActivityDifficulty.BEGINNER) {
            description += " Difficulty is beginner-friendly with short instructions and examples.";
        } else if (difficulty == ActivityDifficulty.ADVANCED) {
            description += " Difficulty is advanced with nuanced prompts and deeper argumentation.";
        }

        return new ActivityBlueprint(title, description, type, difficulty);
    }

    public List<String> buildStudentSuggestions(
            ClubHealthMetricsDto metrics,
            double studentEngagementScore,
            int pendingActivities
    ) {
        List<String> suggestions = new ArrayList<>();
        if (studentEngagementScore < 55) {
            suggestions.add("Join the next speaking session to increase your participation score.");
        }
        if (pendingActivities > 0) {
            suggestions.add("Complete at least one pending activity this week.");
        }
        if (metrics.speakingParticipationRate() < 40) {
            suggestions.add("Post one voice note or join one live speaking room this week.");
        }
        if (metrics.activityCompletionRate() < 60) {
            suggestions.add("Partner with another student for collaborative activity completion.");
        }
        if (suggestions.isEmpty()) {
            suggestions.add("Great momentum. Keep participating and help one peer this week.");
        }
        return suggestions;
    }

    public String engagementBand(double score) {
        if (score >= 80) {
            return "HIGH";
        }
        if (score >= 60) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private double round(double value) {
        return Double.parseDouble(String.format(Locale.ROOT, "%.2f", value));
    }

    public record RecommendationBlueprint(
            String title,
            String description,
            RecommendationPriority priority,
            String reasoning
    ) {
    }

    public record ActivityBlueprint(
            String title,
            String description,
            ClubActivityType type,
            ActivityDifficulty difficulty
    ) {
    }
}

