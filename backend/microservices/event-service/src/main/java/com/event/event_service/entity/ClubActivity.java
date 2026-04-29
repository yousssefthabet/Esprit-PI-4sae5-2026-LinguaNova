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
        name = "club_activities",
        indexes = {
                @Index(name = "idx_club_activity_club", columnList = "club_id"),
                @Index(name = "idx_club_activity_created", columnList = "club_id,created_at")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubActivity {

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
    @Column(name = "activity_type", nullable = false, length = 32)
    private ClubActivityType activityType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ActivityDifficulty difficulty;

    @Column(name = "assigned_members", nullable = false)
    private int assignedMembers;

    @Column(name = "completed_members", nullable = false)
    private int completedMembers;

    @Column(name = "generated_by_ai", nullable = false)
    private boolean generatedByAi;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}

