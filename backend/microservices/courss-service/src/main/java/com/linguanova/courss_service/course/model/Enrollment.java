package com.linguanova.courss_service.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments", indexes = {
    @Index(columnList = "student_id"),
    @Index(columnList = "course_id"),
    @Index(columnList = "student_id, course_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false, length = 255)
    private String studentId;

    @Column(name = "course_id", nullable = false, length = 36)
    private String courseId;

    @Column(name = "stripe_session_id", length = 255)
    private String stripeSessionId;

    @Column(name = "progress")
    private Integer progress = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
