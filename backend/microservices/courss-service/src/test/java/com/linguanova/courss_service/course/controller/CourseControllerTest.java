package com.linguanova.courss_service.course.controller;

import com.linguanova.courss_service.course.dto.CourseRequest;
import com.linguanova.courss_service.course.dto.CourseResponse;
import com.linguanova.courss_service.course.dto.PaginatedResponse;
import com.linguanova.courss_service.course.service.CourseService;
import com.linguanova.courss_service.course.service.LessonFileService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseControllerTest {

    @Mock
    private CourseService courseService;

    @Mock
    private LessonFileService lessonFileService;

    @InjectMocks
    private CourseController courseController;

    @Test
    void getAllCourses_shouldReturnServiceResponse() {
        CourseResponse course = new CourseResponse();
        course.setId("course-1");
        PaginatedResponse<CourseResponse> serviceResponse = new PaginatedResponse<>(
                List.of(course),
                new PaginatedResponse.PaginationMeta(1, 1, 1, 10, false, false)
        );
        when(courseService.getAllCourses(1, 10, "newest")).thenReturn(serviceResponse);

        ResponseEntity<PaginatedResponse<CourseResponse>> response = courseController.getAllCourses(1, 10, "newest");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("course-1", response.getBody().getItems().get(0).getId());
    }

    @Test
    void createCourse_shouldRequireTeacherRole() {
        TestingAuthenticationToken studentAuth = new TestingAuthenticationToken(
                "student@example.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        assertThrows(AccessDeniedException.class,
                () -> courseController.createCourse(new CourseRequest(), studentAuth));
    }

    @Test
    void createCourse_shouldPassInstructorIdentityToService() {
        TestingAuthenticationToken teacherAuth = new TestingAuthenticationToken(
                "teacher@example.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_TEACHER"))
        );
        CourseRequest request = new CourseRequest();
        request.setTitle("English Basics");
        CourseResponse created = new CourseResponse();
        created.setId("course-1");
        when(courseService.createCourse(request, "teacher@example.com", "teacher@example.com")).thenReturn(created);

        ResponseEntity<CourseResponse> response = courseController.createCourse(request, teacherAuth);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("course-1", response.getBody().getId());
    }

    @Test
    void enroll_shouldUseAnonymousWhenNoAuthentication() {
        ResponseEntity<?> response = courseController.enroll("course-1", Map.of("stripeSessionId", "session-1"), null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(courseService).enroll("course-1", "anonymous", "session-1");
    }

    @Test
    void updateProgress_shouldClampValueToValidRange() {
        TestingAuthenticationToken auth = new TestingAuthenticationToken("student@example.com", null);

        ResponseEntity<?> response = courseController.updateProgress("course-1", Map.of("progress", 150), auth);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(courseService).updateProgress("course-1", "student@example.com", 100);
    }

    @Test
    void createCheckoutSession_shouldReturnBadRequestWhenStripeIsMissing() {
        when(courseService.createCheckoutSessionUrl("course-1", "anonymous", "ok", "cancel")).thenReturn(null);

        ResponseEntity<?> response = courseController.createCheckoutSession(
                "course-1",
                Map.of("successUrl", "ok", "cancelUrl", "cancel"),
                null
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
