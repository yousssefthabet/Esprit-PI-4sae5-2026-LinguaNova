package com.linguanova.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Current user profile returned by GET /api/auth/me.
 * Excludes password. Field names aligned with frontend User model where possible.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentUserResponse {

    private Long id;
    private String email;
    private String role;           // STUDENT, TEACHER, ADMIN
    private String firstName;
    private String lastName;
    private String username;       // student
    private String phoneNumber;
    private LocalDate dateOfBirth;
    /** Teaching experience years (parsed from string if numeric). */
    private Integer teachingExperience;
    private String highestEducation;
    private String certificationNumber;
    /** Comma-separated in DB; exposed as list for frontend. */
    private List<String> subjectSpecializations;
    /** Comma-separated in DB; exposed as list for frontend. */
    private List<String> gradeLevels;
    private String profilePhoto;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
