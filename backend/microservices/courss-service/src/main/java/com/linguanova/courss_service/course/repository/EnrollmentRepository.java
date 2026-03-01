package com.linguanova.courss_service.course.repository;

import com.linguanova.courss_service.course.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentIdOrderByCreatedAtDesc(String studentId);

    boolean existsByStudentIdAndCourseId(String studentId, String courseId);

    Optional<Enrollment> findByStudentIdAndCourseId(String studentId, String courseId);
}
