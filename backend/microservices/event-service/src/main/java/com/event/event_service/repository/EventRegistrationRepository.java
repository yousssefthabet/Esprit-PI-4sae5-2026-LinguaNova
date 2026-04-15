package com.event.event_service.repository;

import com.event.event_service.entity.EventRegistration;
import com.event.event_service.entity.EventRegistrationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, EventRegistrationId> {
    boolean existsByEventIdAndStudentId(Long eventId, Long studentId);
}

