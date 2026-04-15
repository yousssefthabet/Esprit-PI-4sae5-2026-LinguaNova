package linguaNova.examen_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedQuizResponse {
    private String title;
    private List<GeneratedQuestionDto> questions;
}
