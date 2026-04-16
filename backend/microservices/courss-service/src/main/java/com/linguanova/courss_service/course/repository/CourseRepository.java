package com.linguanova.courss_service.course.repository;

import com.linguanova.courss_service.course.model.Course;
import com.linguanova.courss_service.course.model.CourseCategory;
import com.linguanova.courss_service.course.model.CourseLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {

    // All published courses
    Page<Course> findByIsPublishedTrue(Pageable pageable);

    // By instructor
    List<Course> findByInstructorId(String instructorId);

    // Search by title
    @Query("SELECT c FROM Course c WHERE c.isPublished = true AND LOWER(c.title) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Course> searchByTitle(@Param("q") String query);

    // Filter by category and level
    Page<Course> findByIsPublishedTrueAndCategoryAndLevel(
        CourseCategory category, CourseLevel level, Pageable pageable);

    Page<Course> findByIsPublishedTrueAndCategory(
        CourseCategory category, Pageable pageable);

    Page<Course> findByIsPublishedTrueAndLevel(
        CourseLevel level, Pageable pageable);
}
