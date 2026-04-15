package com.event.event_service.repository;

import com.event.event_service.entity.Event;
import com.event.event_service.entity.EventRegistration;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByInstructorId(Long instructorId);

    @Query("select e from Event e where e.eventType in (com.event.event_service.entity.EventType.REAL_LIFE, com.event.event_service.entity.EventType.LIVE_MEETING)")
    List<Event> findAllValid();

    @Query("""
            select e
            from Event e
            where e.id in (
                select r.eventId
                from EventRegistration r
                where r.studentId = :studentId
            )
            """)
    List<Event> findJoinedByStudentId(@Param("studentId") Long studentId);
}

