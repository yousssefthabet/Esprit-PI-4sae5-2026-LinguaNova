package linguaNova.examen_service.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String role;

    // STUDENT
    private String username;

    // TEACHER
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String teachingExperience;
    private String highestEducation;
    private String certificationNumber;
    private String subjectSpecializations;
    private String gradeLevels;
    private String profilePhoto;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

