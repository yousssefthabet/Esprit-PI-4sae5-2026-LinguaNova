package com.linguanova.courss_service.course.service;

import com.linguanova.courss_service.course.dto.*;
import com.linguanova.courss_service.course.mapper.CourseMapper;
import com.linguanova.courss_service.course.model.Course;
import com.linguanova.courss_service.course.model.Enrollment;
import com.linguanova.courss_service.course.repository.CourseRepository;
import com.linguanova.courss_service.course.repository.EnrollmentRepository;
import com.linguanova.courss_service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseMapper courseMapper;

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    // GET all courses (paginated)
    public PaginatedResponse<CourseResponse> getAllCourses(int page, int limit, String sortBy) {
        Sort sort = switch (sortBy != null ? sortBy : "newest") {
            case "popular"    -> Sort.by("studentsCount").descending();
            case "price-low"  -> Sort.by("price").ascending();
            case "price-high" -> Sort.by("price").descending();
            case "rating"     -> Sort.by("rating").descending();
            default           -> Sort.by("createdAt").descending(); // newest
        };

        Pageable pageable = PageRequest.of(page - 1, limit, sort);
        Page<Course> coursePage = courseRepository.findByIsPublishedTrue(pageable);

        List<CourseResponse> items = coursePage.getContent().stream()
            .map(courseMapper::toResponse)
            .collect(Collectors.toList());

        var meta = new PaginatedResponse.PaginationMeta(
            page,
            coursePage.getTotalPages(),
            coursePage.getTotalElements(),
            limit,
            coursePage.hasNext(),
            coursePage.hasPrevious()
        );

        return new PaginatedResponse<>(items, meta);
    }

    // GET course by ID
    public CourseResponse getCourseById(String id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", id));
        return courseMapper.toResponse(course);
    }

    // GET instructor's courses
    public List<CourseResponse> getInstructorCourses(String instructorId) {
        return courseRepository.findByInstructorId(instructorId).stream()
            .map(courseMapper::toResponse)
            .collect(Collectors.toList());
    }

    // POST create course
    public CourseResponse createCourse(CourseRequest request, String instructorId, String instructorName) {
        Course course = courseMapper.fromRequest(request, instructorId, instructorName);
        Course saved = courseRepository.save(course);
        return courseMapper.toResponse(saved);
    }

    // PUT update course
    public CourseResponse updateCourse(String id, CourseRequest request, String instructorId) {
        Course existing = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", id));

        if (!existing.getInstructorId().equals(instructorId)) {
            throw new AccessDeniedException("You do not own this course");
        }

        existing.setTitle(request.getTitle() != null ? request.getTitle().trim() : existing.getTitle());
        existing.setShortDescription(request.getShortDescription() != null ? request.getShortDescription().trim() : "");
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        existing.setCategory(request.getCategory() != null ? request.getCategory() : existing.getCategory());
        existing.setLevel(request.getLevel() != null ? request.getLevel() : existing.getLevel());
        existing.setPrice(request.getPrice() != null && request.getPrice() >= 0 ? request.getPrice() : existing.getPrice());
        if (request.getImage() != null) existing.setImage(request.getImage());
        existing.setIsPublished(request.getIsPublished() != null ? request.getIsPublished() : false);
        existing.setLanguage(request.getLanguage() != null ? request.getLanguage() : "English");

        existing.getModules().clear();
        existing.getQuizzes().clear();
        Course rebuilt = courseMapper.fromRequest(request, instructorId, existing.getInstructorName());
        if (rebuilt.getModules() != null) {
            existing.getModules().addAll(rebuilt.getModules());
            existing.getModules().forEach(m -> m.setCourse(existing));
        }
        if (rebuilt.getQuizzes() != null) {
            existing.getQuizzes().addAll(rebuilt.getQuizzes());
            existing.getQuizzes().forEach(q -> q.setCourse(existing));
        }

        Course saved = courseRepository.save(existing);
        return courseMapper.toResponse(saved);
    }

    // DELETE course
    public void deleteCourse(String id, String instructorId) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", id));

        if (!course.getInstructorId().equals(instructorId)) {
            throw new AccessDeniedException("You do not own this course");
        }

        courseRepository.delete(course);
    }

    // SEARCH courses
    public List<CourseResponse> searchCourses(String query) {
        return courseRepository.searchByTitle(query).stream()
            .map(courseMapper::toResponse)
            .collect(Collectors.toList());
    }

    // ENROLL student in course (after payment or with Stripe session verification)
    public Enrollment enroll(String courseId, String studentId, String stripeSessionId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).orElseThrow();
        }
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));
        Enrollment enrollment = Enrollment.builder()
            .studentId(studentId)
            .courseId(courseId)
            .stripeSessionId(stripeSessionId)
            .progress(0)
            .build();
        enrollment = enrollmentRepository.save(enrollment);
        course.setStudentsCount(course.getStudentsCount() == null ? 1 : course.getStudentsCount() + 1);
        courseRepository.save(course);
        return enrollment;
    }

    // GET enrolled courses for student (with progress)
    public List<CourseResponse> getEnrolledCourses(String studentId) {
        return enrollmentRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
            .map(e -> {
                Course course = courseRepository.findById(e.getCourseId()).orElse(null);
                if (course == null) return null;
                CourseResponse r = courseMapper.toResponse(course);
                r.setProgress(e.getProgress() != null ? e.getProgress() : 0);
                return r;
            })
            .filter(r -> r != null)
            .collect(Collectors.toList());
    }

    public void updateProgress(String courseId, String studentId, int progressPercent) {
        enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).ifPresent(e -> {
            e.setProgress(progressPercent);
            enrollmentRepository.save(e);
        });
    }

    // Create Stripe Checkout Session URL for course purchase
    public String createCheckoutSessionUrl(String courseId, String studentId, String successUrl, String cancelUrl) {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            return null;
        }
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));
        try {
            com.stripe.Stripe.apiKey = stripeSecretKey;
            com.stripe.param.checkout.SessionCreateParams params = com.stripe.param.checkout.SessionCreateParams.builder()
                .setMode(com.stripe.param.checkout.SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl + (successUrl.contains("?") ? "&" : "?") + "session_id={CHECKOUT_SESSION_ID}&course_id=" + courseId)
                .setCancelUrl(cancelUrl)
                .setCustomerEmail(null)
                .addLineItem(
                    com.stripe.param.checkout.SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(
                            com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmountDecimal(java.math.BigDecimal.valueOf((course.getPrice() == null ? 0 : course.getPrice()) * 100))
                                .setProductData(
                                    com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(course.getTitle())
                                        .setDescription(course.getShortDescription() != null ? course.getShortDescription() : "")
                                        .build()
                                )
                                .build()
                        )
                        .build()
                )
                .putMetadata("courseId", courseId)
                .putMetadata("studentId", studentId)
                .build();
            com.stripe.model.checkout.Session session = com.stripe.model.checkout.Session.create(params);
            return session.getUrl();
        } catch (Exception e) {
            throw new RuntimeException("Stripe session creation failed: " + e.getMessage());
        }
    }
}
