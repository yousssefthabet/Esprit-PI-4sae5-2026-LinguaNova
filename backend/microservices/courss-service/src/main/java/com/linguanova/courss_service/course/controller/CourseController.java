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

    @GetMapping("/enrolled")
    public ResponseEntity<List<CourseResponse>> getEnrolledCourses(Authentication auth) {
        String studentId = auth != null ? auth.getName() : "anonymous";
        return ResponseEntity.ok(courseService.getEnrolledCourses(studentId));
    }

    @PostMapping("/{id}/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(
        @PathVariable String id,
        @RequestBody(required = false) java.util.Map<String, String> body,
        Authentication auth
    ) {
        String studentId = auth != null ? auth.getName() : "anonymous";
        String successUrl = body != null && body.containsKey("successUrl") ? body.get("successUrl") : "http://localhost:4200/checkout?success=1";
        String cancelUrl = body != null && body.containsKey("cancelUrl") ? body.get("cancelUrl") : "http://localhost:4200/checkout?cancel=1";
        String url = courseService.createCheckoutSessionUrl(id, studentId, successUrl, cancelUrl);
        if (url == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Stripe not configured. Set stripe.secret-key in application.properties."));
        }
        return ResponseEntity.ok(java.util.Map.of("url", url));
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<?> enroll(
        @PathVariable String id,
        @RequestBody(required = false) java.util.Map<String, String> body,
        Authentication auth
    ) {
        String studentId = auth != null ? auth.getName() : "anonymous";
        String sessionId = body != null && body.containsKey("stripeSessionId") ? body.get("stripeSessionId") : null;
        courseService.enroll(id, studentId, sessionId);
        return ResponseEntity.ok(java.util.Map.of(
            "courseId", id,
            "enrollmentId", "ok",
            "message", "Enrolled successfully."
        ));
    }

    private void ensureInstructor(Authentication auth) {
        if (devMode) return;
        if (auth == null || !auth.isAuthenticated())
            throw new AccessDeniedException("Authentication required");
        boolean hasRole = auth.getAuthorities().stream()
            .anyMatch(a -> "ROLE_INSTRUCTOR".equals(a.getAuthority()) || "ROLE_TEACHER".equals(a.getAuthority()));
        if (!hasRole) throw new AccessDeniedException("INSTRUCTOR or TEACHER role required");
    }

    private String getInstructorId(Authentication auth) {
        if (devMode && (auth == null || !auth.isAuthenticated())) return "dev-instructor";
        return auth != null ? auth.getName() : "dev-instructor";
    }

    private String getInstructorName(Authentication auth) {
        if (devMode && (auth == null || !auth.isAuthenticated())) return "Dev Instructor";
        if (auth == null) return "Instructor";
        // user-service JWT may contain "name" claim for teachers
        if (auth.getDetails() instanceof io.jsonwebtoken.Claims claims) {
            Object name = claims.get("name");
            if (name != null && name.toString().length() > 0) return name.toString().trim();
        }
        return auth.getName(); // fallback: email
    }
}
