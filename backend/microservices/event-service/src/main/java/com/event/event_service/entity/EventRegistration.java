package com.event.event_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "event_registrations")
@IdClass(EventRegistrationId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistration {

    @NotNull
    @Id
    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @NotNull
    @Id
    @Column(name = "student_id", nullable = false)
    private Long studentId;
}

