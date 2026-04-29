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
        name = "ai_recommendations",
        indexes = {
                @Index(name = "idx_ai_recommendation_club", columnList = "club_id"),
                @Index(name = "idx_ai_recommendation_status", columnList = "club_id,status")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "club_id", nullable = false, length = 120)
    private String clubId;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private RecommendationPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private RecommendationStatus status;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reasoning;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

