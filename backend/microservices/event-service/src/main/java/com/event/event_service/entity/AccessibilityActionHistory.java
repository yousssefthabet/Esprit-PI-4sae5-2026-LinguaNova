package com.event.event_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "accessibility_action_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessibilityActionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 120)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false, length = 20)
    private AccessibilityActionType actionType;

    @Lob
    @Column(name = "input_payload", columnDefinition = "LONGTEXT")
    private String inputPayload;

    @Lob
    @Column(name = "output_payload", columnDefinition = "LONGTEXT")
    private String outputPayload;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}

