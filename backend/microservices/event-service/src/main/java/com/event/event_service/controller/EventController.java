package com.event.event_service.controller;

import com.event.event_service.entity.Event;
import com.event.event_service.service.EventService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping({"", "/"})
    public ResponseEntity<Event> create(@Valid @RequestBody Event event) {
        Event created = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping({"", "/"})
    public ResponseEntity<List<Event>> getAll() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<Event>> getByInstructor(@PathVariable Long instructorId) {
        return ResponseEntity.ok(eventService.getEventsByInstructorId(instructorId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Event>> getJoinedByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(eventService.getJoinedEventsByStudentId(studentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> update(@PathVariable Long id, @Valid @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<Map<String, String>> register(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body
    ) {
        Long studentId = body.get("student_id");
        if (studentId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "student_id is required"));
        }
        eventService.registerStudent(id, studentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Registered successfully"));
    }
}

