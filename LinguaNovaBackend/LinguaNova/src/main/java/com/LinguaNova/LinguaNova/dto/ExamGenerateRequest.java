package com.LinguaNova.LinguaNova.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ExamGenerateRequest {

    @NotBlank(message = "Le titre est requis")
    private String title;

    @NotBlank(message = "La description est requise")
    private String description;

    @NotBlank(message = "Le nom du cours est requis")
    private String courseName;

    @NotBlank(message = "La difficulté est requise")
    private String difficulty;

    @NotNull
    @Min(1)
    @Max(20)
    private Integer numQuestions;
}
