package com.event.event_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "engagement_scores",
        indexes = {
                @Index(name = "idx_engagement_score_club", columnList = "club_id"),
                @Index(name = "idx_engagement_score_calculated", columnList = "club_id,calculated_at")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EngagementScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "club_id", nullable = false, length = 120)
    private String clubId;

    @Column(name = "health_score", nullable = false)
    private double healthScore;

    @Column(name = "engagement_rate", nullable = false)
    private double engagementRate;

    @Column(name = "attendance_rate", nullable = false)
    private double attendanceRate;

    @Column(name = "activity_completion_rate", nullable = false)
    private double activityCompletionRate;

    @Column(name = "average_level_progression", nullable = false)
    private double averageLevelProgression;

    @Column(name = "speaking_participation_rate", nullable = false)
    private double speakingParticipationRate;

    @Column(name = "inactivity_rate", nullable = false)
    private double inactivityRate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String interpretation;

    @Column(name = "calculated_at", nullable = false)
    private LocalDateTime calculatedAt;
}

