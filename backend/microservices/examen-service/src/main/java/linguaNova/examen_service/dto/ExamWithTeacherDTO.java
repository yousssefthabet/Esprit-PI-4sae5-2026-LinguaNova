package linguaNova.examen_service.dto;

import linguaNova.examen_service.entity.Exam;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamWithTeacherDTO {

    private Exam exam;
    private UserResponse teacher;
}

