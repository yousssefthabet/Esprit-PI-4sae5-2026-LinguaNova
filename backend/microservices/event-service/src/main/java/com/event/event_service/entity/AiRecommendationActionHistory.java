package com.event.event_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
        name = "ai_recommendation_action_history",
        indexes = {
                @Index(name = "idx_ai_recommendation_history_club", columnList = "club_id"),
                @Index(name = "idx_ai_recommendation_history_rec", columnList = "recommendation_id")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRecommendationActionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recommendation_id", nullable = false)
    private Long recommendationId;

    @Column(name = "club_id", nullable = false, length = 120)
    private String clubId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private RecommendationStatus status;

    @Column(name = "admin_id", length = 120)
    private String adminId;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "acted_at", nullable = false)
    private LocalDateTime actedAt;
}

