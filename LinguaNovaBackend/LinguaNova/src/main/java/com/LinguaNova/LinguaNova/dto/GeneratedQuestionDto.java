package com.LinguaNova.LinguaNova.dto;

import lombok.Data;

import java.util.List;

@Data
public class GeneratedQuestionDto {
    private String content;
    private String type; // "QCM" or "TRUE_FALSE"
    private List<String> options;
    private int correctIndex;
}
