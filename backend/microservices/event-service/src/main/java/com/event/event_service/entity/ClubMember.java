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
        name = "club_members",
        indexes = {
                @Index(name = "idx_club_member_club", columnList = "club_id"),
                @Index(name = "idx_club_member_student", columnList = "student_id"),
                @Index(name = "idx_club_member_active", columnList = "club_id,active")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "club_id", nullable = false, length = 120)
    private String clubId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;

    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "level_at_join", nullable = false)
    private int levelAtJoin;

    @Column(name = "current_level", nullable = false)
    private int currentLevel;

    @Column(name = "speaking_contributions", nullable = false)
    private int speakingContributions;
}

