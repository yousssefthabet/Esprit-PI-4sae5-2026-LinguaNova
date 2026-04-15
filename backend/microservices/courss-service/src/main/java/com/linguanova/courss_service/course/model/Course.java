package com.linguanova.courss_service.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Course attributes:
 * - price
 * - Course Title (title)
 * - Short Hook (shortDescription)
 * - Full Prospectus (description)
 * - image (Course Thumbnail)
 * - Academic Category (category enum)
 * - Skill Elevation (level enum)
 * Plus: modules, quizzes, and minimal app fields (instructor, isPublished, timestamps).
 */
@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @UuidGenerator
    private String id;

    /** Course Title */
    @Column(nullable = false, length = 255)
    private String title;

    /** Short Hook */
    @Column(name = "short_description", length = 500)
    private String shortDescription;

    /** Full Prospectus */
    @Column(columnDefinition = "LONGTEXT")
    private String description;

    /** Course Thumbnail (URL or base64 data; LONGTEXT to avoid truncation) */
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    /** Academic Category */
    @Enumerated(EnumType.STRING)
    private CourseCategory category;

    /** Skill Elevation */
    @Enumerated(EnumType.STRING)
    private CourseLevel level;

    private Double price;
    @Column(name = "is_published")
    private Boolean isPublished = false;
    private String language = "English";

    @Column(name = "students_count")
    private Integer studentsCount = 0;
    private Double rating = 0.0;
    @Column(name = "reviews_count")
    private Integer reviewsCount = 0;

    @Column(name = "instructor_id")
    private String instructorId;
    @Column(name = "instructor_name")
    private String instructorName;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("moduleOrder ASC")
    @Builder.Default
    private List<CourseModule> modules = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Quiz> quizzes = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
