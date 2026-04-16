package com.event.event_service.service;

import com.event.event_service.entity.Event;
import com.event.event_service.entity.EventRegistration;
import com.event.event_service.repository.EventRepository;
import com.event.event_service.repository.EventRegistrationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;

    public Event createEvent(Event event) {
        event.setId(null);
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAllValid();
    }

    public List<Event> getEventsByInstructorId(Long instructorId) {
        return eventRepository.findByInstructorId(instructorId);
    }

    public List<Event> getJoinedEventsByStudentId(Long studentId) {
        return eventRepository.findJoinedByStudentId(studentId);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    public Event updateEvent(Long id, Event event) {
        Event existing = getEventById(id);
        existing.setEventTitle(event.getEventTitle());
        existing.setSessionDescription(event.getSessionDescription());
        existing.setCategory(event.getCategory());
        existing.setEventType(event.getEventType());
        existing.setEventDate(event.getEventDate());
        existing.setStartAt(event.getStartAt());
        existing.setEndsAt(event.getEndsAt());
        existing.setVirtualClassroom(event.getVirtualClassroom());
        existing.setMeetingLink(event.getMeetingLink());
        existing.setInstructorId(event.getInstructorId());
        existing.setMaxAttendees(event.getMaxAttendees());
        existing.setImageUrl(event.getImageUrl());
        existing.setLatitude(event.getLatitude());
        existing.setLocationName(event.getLocationName());
        existing.setLongitude(event.getLongitude());
        return eventRepository.save(existing);
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }
        eventRepository.deleteById(id);
    }

    public void registerStudent(Long eventId, Long studentId) {
        getEventById(eventId);
        if (eventRegistrationRepository.existsByEventIdAndStudentId(eventId, studentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already registered");
        }
        eventRegistrationRepository.save(EventRegistration.builder()
                .eventId(eventId)
                .studentId(studentId)
                .build());
    }
}

