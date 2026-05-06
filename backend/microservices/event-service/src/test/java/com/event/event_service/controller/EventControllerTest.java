package com.event.event_service.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.event.event_service.entity.Event;
import com.event.event_service.entity.EventType;
import com.event.event_service.service.EventService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    @Test
    void create_shouldReturnCreatedEvent() {
        Event payload = sampleEvent(null);
        Event created = sampleEvent(1L);
        when(eventService.createEvent(payload)).thenReturn(created);

        ResponseEntity<Event> response = eventController.create(payload);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(created, response.getBody());
        verify(eventService).createEvent(payload);
    }

    @Test
    void getByInstructor_shouldReturnInstructorEvents() {
        List<Event> events = List.of(sampleEvent(1L));
        when(eventService.getEventsByInstructorId(4L)).thenReturn(events);

        ResponseEntity<List<Event>> response = eventController.getByInstructor(4L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(events, response.getBody());
    }

    @Test
    void register_shouldRejectMissingStudentId() {
        ResponseEntity<Map<String, String>> response = eventController.register(1L, Map.of());

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("student_id is required", response.getBody().get("message"));
    }

    @Test
    void register_shouldReturnCreatedWhenStudentIdProvided() {
        ResponseEntity<Map<String, String>> response = eventController.register(1L, Map.of("student_id", 7L));

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Registered successfully", response.getBody().get("message"));
        verify(eventService).registerStudent(1L, 7L);
    }

    @Test
    void delete_shouldReturnNoContent() {
        ResponseEntity<Void> response = eventController.delete(5L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(eventService).deleteEvent(5L);
    }

    private Event sampleEvent(Long id) {
        return Event.builder()
                .id(id)
                .eventTitle("Conversation meetup")
                .sessionDescription("Practice speaking")
                .category("Speaking")
                .eventType(EventType.REAL_LIFE)
                .eventDate(LocalDate.of(2026, 5, 20))
                .startAt(LocalTime.of(10, 0))
                .endsAt(LocalTime.of(12, 0))
                .instructorId(4L)
                .maxAttendees(30)
                .build();
    }
}
