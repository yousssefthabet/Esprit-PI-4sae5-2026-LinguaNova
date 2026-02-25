package com.linguanova.courss_service.course.controller;

import com.linguanova.courss_service.course.dto.*;
import com.linguanova.courss_service.course.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @Value("${app.course.dev-mode:false}")
    private boolean devMode;

    @GetMapping
    public ResponseEntity<PaginatedResponse<CourseResponse>> getAllCourses(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit,
        @RequestParam(required = false) String sortBy
    ) {
        return ResponseEntity.ok(courseService.getAllCourses(page, limit, sortBy));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CourseResponse>> searchCourses(@RequestParam String q) {
        return ResponseEntity.ok(courseService.searchCourses(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable String id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/instructor")
    public ResponseEntity<List<CourseResponse>> getInstructorCourses(Authentication auth) {
        ensureInstructor(auth);
        String instructorId = getInstructorId(auth);
        return ResponseEntity.ok(courseService.getInstructorCourses(instructorId));
    }

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(
        @Valid @RequestBody CourseRequest request,
        Authentication auth
    ) {
        ensureInstructor(auth);
        String instructorId = getInstructorId(auth);
        String instructorName = getInstructorName(auth);
        CourseResponse created = courseService.createCourse(request, instructorId, instructorName);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
        @PathVariable String id,
        @Valid @RequestBody CourseRequest request,
        Authentication auth
    ) {
        ensureInstructor(auth);
        String instructorId = getInstructorId(auth);
        return ResponseEntity.ok(courseService.updateCourse(id, request, instructorId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id, Authentication auth) {
        ensureInstructor(auth);
        String instructorId = getInstructorId(auth);
        courseService.deleteCourse(id, instructorId);
        return ResponseEntity.noContent().build();
    }

    private void ensureInstructor(Authentication auth) {
        if (devMode) return;
        if (auth == null || !auth.isAuthenticated())
            throw new AccessDeniedException("Authentication required");
        boolean hasRole = auth.getAuthorities().stream()
            .anyMatch(a -> "ROLE_INSTRUCTOR".equals(a.getAuthority()));
        if (!hasRole) throw new AccessDeniedException("INSTRUCTOR role required");
    }

    private String getInstructorId(Authentication auth) {
        if (devMode && (auth == null || !auth.isAuthenticated())) return "dev-instructor";
        return auth != null ? auth.getName() : "dev-instructor";
    }

    private String getInstructorName(Authentication auth) {
        if (devMode && (auth == null || !auth.isAuthenticated())) return "Dev Instructor";
        return auth != null ? auth.getName() : "Dev Instructor";
    }
}
