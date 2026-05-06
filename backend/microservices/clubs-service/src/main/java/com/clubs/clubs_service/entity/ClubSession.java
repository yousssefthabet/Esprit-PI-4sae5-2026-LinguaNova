package com.clubs.clubs_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "club_sessions",
        indexes = {
                @Index(name = "idx_club_session_club", columnList = "club_id"),
                @Index(name = "idx_club_session_date", columnList = "club_id,session_date")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "club_id", nullable = false, length = 120)
    private String clubId;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;

    @Column(name = "attendee_count", nullable = false)
    private int attendeeCount;

    @Column(name = "speaking_participants_count", nullable = false)
    private int speakingParticipantsCount;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;
}

