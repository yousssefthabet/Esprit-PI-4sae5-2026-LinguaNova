package com.event.event_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.event.event_service.entity.Event;
import com.event.event_service.entity.EventRegistration;
import com.event.event_service.entity.EventType;
import com.event.event_service.repository.EventRegistrationRepository;
import com.event.event_service.repository.EventRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventRegistrationRepository eventRegistrationRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void createEvent_shouldClearIncomingIdBeforeSaving() {
        Event payload = sampleEvent(99L);
        when(eventRepository.save(payload)).thenReturn(sampleEvent(1L));

        Event result = eventService.createEvent(payload);

        assertEquals(1L, result.getId());
        assertEquals(null, payload.getId());
        verify(eventRepository).save(payload);
    }

    @Test
    void getAllEvents_shouldUseValidEventsQuery() {
        List<Event> events = List.of(sampleEvent(1L));
        when(eventRepository.findAllValid()).thenReturn(events);

        assertSame(events, eventService.getAllEvents());
    }

    @Test
    void getEventById_shouldThrowNotFoundWhenMissing() {
        when(eventRepository.findById(42L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> eventService.getEventById(42L));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void updateEvent_shouldCopyEditableFieldsAndSave() {
        Event existing = sampleEvent(1L);
        Event update = sampleEvent(null);
        update.setEventTitle("Updated event");
        update.setInstructorId(8L);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(eventRepository.save(existing)).thenReturn(existing);

        Event result = eventService.updateEvent(1L, update);

        assertSame(existing, result);
        assertEquals("Updated event", existing.getEventTitle());
        assertEquals(8L, existing.getInstructorId());
        verify(eventRepository).save(existing);
    }

    @Test
    void deleteEvent_shouldThrowWhenEventDoesNotExist() {
        when(eventRepository.existsById(1L)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> eventService.deleteEvent(1L));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void registerStudent_shouldRejectDuplicateRegistration() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent(1L)));
        when(eventRegistrationRepository.existsByEventIdAndStudentId(1L, 7L)).thenReturn(true);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> eventService.registerStudent(1L, 7L));

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void registerStudent_shouldSaveRegistration() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent(1L)));
        when(eventRegistrationRepository.existsByEventIdAndStudentId(1L, 7L)).thenReturn(false);

        eventService.registerStudent(1L, 7L);

        ArgumentCaptor<EventRegistration> captor = ArgumentCaptor.forClass(EventRegistration.class);
        verify(eventRegistrationRepository).save(captor.capture());
        assertEquals(1L, captor.getValue().getEventId());
        assertEquals(7L, captor.getValue().getStudentId());
    }

    private Event sampleEvent(Long id) {
        return Event.builder()
                .id(id)
                .eventTitle("Conversation meetup")
                .sessionDescription("Practice speaking")
                .category("Speaking")
                .eventType(EventType.LIVE_MEETING)
                .eventDate(LocalDate.of(2026, 5, 20))
                .startAt(LocalTime.of(10, 0))
                .endsAt(LocalTime.of(12, 0))
                .virtualClassroom(true)
                .meetingLink("https://meet.example.com")
                .instructorId(4L)
                .maxAttendees(30)
                .build();
    }
}
