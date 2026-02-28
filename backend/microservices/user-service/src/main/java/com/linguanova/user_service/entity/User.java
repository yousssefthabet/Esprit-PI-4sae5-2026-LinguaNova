package com.linguanova.user_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = @Index(columnList = "email", unique = true))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    // ----- STUDENT-specific (nullable for TEACHER) -----
    @Column(length = 100)
    private String username;

    // ----- TEACHER-specific (all nullable for STUDENT) -----
    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "teaching_experience", length = 500)
    private String teachingExperience;

    @Column(name = "highest_education", length = 200)
    private String highestEducation;

    @Column(name = "certification_number", length = 100)
    private String certificationNumber;

    @Column(name = "subject_specializations", length = 500)
    private String subjectSpecializations;

    @Column(name = "grade_levels_taught", length = 200)
    private String gradeLevelsTaught;

    @Column(name = "profile_photo", length = 1000)
    private String profilePhoto;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
