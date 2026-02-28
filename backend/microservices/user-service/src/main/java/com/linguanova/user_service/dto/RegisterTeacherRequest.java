package com.linguanova.user_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterTeacherRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "First name is required")
    @Size(max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    private String lastName;

    @Size(max = 30)
    private String phoneNumber;

    private LocalDate dateOfBirth;

    @Size(max = 500)
    private String teachingExperience;

    @Size(max = 200)
    private String highestEducation;

    @Size(max = 100)
    private String certificationNumber;

    @Size(max = 500)
    private String subjectSpecializations;

    @Size(max = 200)
    private String gradeLevelsTaught;

    @Size(max = 1000)
    private String profilePhoto;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
