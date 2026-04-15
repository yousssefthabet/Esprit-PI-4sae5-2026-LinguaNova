package linguaNova.examen_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuizGenerateRequest {

    @NotBlank(message = "Le thème est requis")
    private String topic;

    @NotBlank(message = "La difficulté est requise")
    private String difficulty;

    @NotNull
    @Min(1)
    @Max(20)
    private Integer numQuestions;
}
