package com.linguanova.courss_service.course.service;

import com.linguanova.courss_service.course.dto.CourseRequest;
import com.linguanova.courss_service.course.dto.CourseResponse;
import com.linguanova.courss_service.course.dto.PaginatedResponse;
import com.linguanova.courss_service.course.mapper.CourseMapper;
import com.linguanova.courss_service.course.model.Course;
import com.linguanova.courss_service.course.model.CourseCategory;
import com.linguanova.courss_service.course.model.CourseLevel;
import com.linguanova.courss_service.course.model.Enrollment;
import com.linguanova.courss_service.course.repository.CourseRepository;
import com.linguanova.courss_service.course.repository.EnrollmentRepository;
import com.linguanova.courss_service.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private CourseMapper courseMapper;

    @InjectMocks
    private CourseService courseService;

    @Test
    void getAllCourses_shouldUsePublishedCoursesAndPaginationMetadata() {
        Course course = Course.builder().id("course-1").title("English").build();
        CourseResponse response = new CourseResponse();
        response.setId("course-1");
        response.setTitle("English");
        when(courseRepository.findByIsPublishedTrue(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(course)));
        when(courseMapper.toResponse(course)).thenReturn(response);

        PaginatedResponse<CourseResponse> result = courseService.getAllCourses(1, 10, "price-low");

        assertEquals(1, result.getItems().size());
        assertEquals("course-1", result.getItems().get(0).getId());
        assertEquals(1, result.getPagination().getCurrentPage());
        assertEquals(1, result.getPagination().getTotalItems());
        verify(courseRepository).findByIsPublishedTrue(any(Pageable.class));
    }

    @Test
    void getCourseById_shouldReturnMappedCourse() {
        Course course = Course.builder().id("course-1").title("English").build();
        CourseResponse response = new CourseResponse();
        response.setId("course-1");
        when(courseRepository.findById("course-1")).thenReturn(Optional.of(course));
        when(courseMapper.toResponse(course)).thenReturn(response);

        assertSame(response, courseService.getCourseById("course-1"));
    }

    @Test
    void getCourseById_shouldThrowWhenMissing() {
        when(courseRepository.findById("missing")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> courseService.getCourseById("missing"));
    }

    @Test
    void createCourse_shouldBuildSaveAndMapCourse() {
        CourseRequest request = new CourseRequest();
        request.setTitle("English Basics");
        Course built = Course.builder().title("English Basics").instructorId("teacher-1").build();
        Course saved = Course.builder().id("course-1").title("English Basics").instructorId("teacher-1").build();
        CourseResponse response = new CourseResponse();
        response.setId("course-1");
        when(courseMapper.fromRequest(request, "teacher-1", "Teacher One")).thenReturn(built);
        when(courseRepository.save(built)).thenReturn(saved);
        when(courseMapper.toResponse(saved)).thenReturn(response);

        CourseResponse result = courseService.createCourse(request, "teacher-1", "Teacher One");

        assertEquals("course-1", result.getId());
        verify(courseRepository).save(built);
    }

    @Test
    void updateCourse_shouldRejectInstructorThatDoesNotOwnCourse() {
        Course existing = Course.builder().id("course-1").instructorId("teacher-1").build();
        when(courseRepository.findById("course-1")).thenReturn(Optional.of(existing));

        assertThrows(AccessDeniedException.class,
                () -> courseService.updateCourse("course-1", new CourseRequest(), "teacher-2"));
    }

    @Test
    void updateCourse_shouldUpdateAllowedFieldsForOwner() {
        Course existing = Course.builder()
                .id("course-1")
                .title("Old")
                .shortDescription("Old short")
                .description("Old description")
                .category(CourseCategory.ENGLISH_LANGUAGE)
                .level(CourseLevel.BEGINNER)
                .price(10.0)
                .isPublished(false)
                .language("English")
                .instructorId("teacher-1")
                .instructorName("Teacher One")
                .build();
        CourseRequest request = new CourseRequest();
        request.setTitle(" Updated title ");
        request.setShortDescription(" Updated short ");
        request.setDescription(" Updated description ");
        request.setCategory(CourseCategory.BUSINESS_ENGLISH);
        request.setLevel(CourseLevel.INTERMEDIATE);
        request.setPrice(25);
        request.setIsPublished(true);
        request.setLanguage("French");
        Course rebuilt = Course.builder().build();
        CourseResponse response = new CourseResponse();
        response.setTitle("Updated title");

        when(courseRepository.findById("course-1")).thenReturn(Optional.of(existing));
        when(courseMapper.fromRequest(request, "teacher-1", "Teacher One")).thenReturn(rebuilt);
        when(courseRepository.save(existing)).thenReturn(existing);
        when(courseMapper.toResponse(existing)).thenReturn(response);

        CourseResponse result = courseService.updateCourse("course-1", request, "teacher-1");

        assertEquals("Updated title", result.getTitle());
        assertEquals("Updated title", existing.getTitle());
        assertEquals(25.0, existing.getPrice());
        assertEquals(CourseCategory.BUSINESS_ENGLISH, existing.getCategory());
    }

    @Test
    void deleteCourse_shouldDeleteWhenOwnerMatches() {
        Course course = Course.builder().id("course-1").instructorId("teacher-1").build();
        when(courseRepository.findById("course-1")).thenReturn(Optional.of(course));

        courseService.deleteCourse("course-1", "teacher-1");

        verify(courseRepository).delete(course);
    }

    @Test
    void enroll_shouldReturnExistingEnrollmentWhenAlreadyEnrolled() {
        Enrollment existing = Enrollment.builder().id(2L).studentId("student-1").courseId("course-1").build();
        when(enrollmentRepository.existsByStudentIdAndCourseId("student-1", "course-1")).thenReturn(true);
        when(enrollmentRepository.findByStudentIdAndCourseId("student-1", "course-1")).thenReturn(Optional.of(existing));

        Enrollment result = courseService.enroll("course-1", "student-1", "session-1");

        assertSame(existing, result);
    }

    @Test
    void enroll_shouldCreateEnrollmentAndIncrementStudentsCount() {
        Course course = Course.builder().id("course-1").studentsCount(2).build();
        when(enrollmentRepository.existsByStudentIdAndCourseId("student-1", "course-1")).thenReturn(false);
        when(courseRepository.findById("course-1")).thenReturn(Optional.of(course));
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Enrollment result = courseService.enroll("course-1", "student-1", "session-1");

        assertEquals("course-1", result.getCourseId());
        assertEquals("student-1", result.getStudentId());
        assertEquals(3, course.getStudentsCount());
        verify(courseRepository).save(course);
    }

    @Test
    void getEnrolledCourses_shouldSkipMissingCoursesAndIncludeProgress() {
        Enrollment enrollment = Enrollment.builder().studentId("student-1").courseId("course-1").progress(70).build();
        Course course = Course.builder().id("course-1").title("English").build();
        CourseResponse response = new CourseResponse();
        response.setId("course-1");
        when(enrollmentRepository.findByStudentIdOrderByCreatedAtDesc("student-1")).thenReturn(List.of(enrollment));
        when(courseRepository.findById("course-1")).thenReturn(Optional.of(course));
        when(courseMapper.toResponse(course)).thenReturn(response);

        List<CourseResponse> result = courseService.getEnrolledCourses("student-1");

        assertEquals(1, result.size());
        assertEquals(70, result.get(0).getProgress());
    }

    @Test
    void updateProgress_shouldSaveOnlyWhenEnrollmentExists() {
        Enrollment enrollment = Enrollment.builder().studentId("student-1").courseId("course-1").progress(0).build();
        when(enrollmentRepository.findByStudentIdAndCourseId("student-1", "course-1")).thenReturn(Optional.of(enrollment));

        courseService.updateProgress("course-1", "student-1", 55);

        assertEquals(55, enrollment.getProgress());
        verify(enrollmentRepository).save(enrollment);
    }

    @Test
    void createCheckoutSessionUrl_shouldReturnNullWhenStripeIsNotConfigured() {
        assertNull(courseService.createCheckoutSessionUrl("course-1", "student-1", "success", "cancel"));
    }
}
