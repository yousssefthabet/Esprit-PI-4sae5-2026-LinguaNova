package linguaNova.examen_service.dto;

import linguaNova.examen_service.entity.StudentExam;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentExamWithUserDTO {

    private StudentExam studentExam;
    private UserResponse student;
    private UserResponse teacher;
}

