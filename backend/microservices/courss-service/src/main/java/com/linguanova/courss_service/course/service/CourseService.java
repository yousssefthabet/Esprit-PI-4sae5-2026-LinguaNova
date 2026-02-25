package com.linguanova.courss_service.course.service;

import com.linguanova.courss_service.course.dto.*;
import com.linguanova.courss_service.course.mapper.CourseMapper;
import com.linguanova.courss_service.course.model.Course;
import com.linguanova.courss_service.course.repository.CourseRepository;
import com.linguanova.courss_service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
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
    private final CourseMapper courseMapper;

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
}
