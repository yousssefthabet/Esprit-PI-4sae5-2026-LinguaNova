package com.LinguaNova.LinguaNova.controller;

import com.LinguaNova.LinguaNova.dto.ExamGenerateRequest;
import com.LinguaNova.LinguaNova.dto.GeneratedQuizResponse;
import com.LinguaNova.LinguaNova.dto.QuizGenerateRequest;
import com.LinguaNova.LinguaNova.service.GeminiQuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@Tag(name = "Quiz IA", description = "Génération de quiz via Gemini")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class QuizController {

    private final GeminiQuizService geminiQuizService;

    public QuizController(GeminiQuizService geminiQuizService) {
        this.geminiQuizService = geminiQuizService;
    }

    @PostMapping("/generate")
    @Operation(summary = "Générer un quiz", description = "Génère un quiz en anglais via l'API Gemini (thème, difficulté, nombre de questions)")
    public ResponseEntity<GeneratedQuizResponse> generate(@Valid @RequestBody QuizGenerateRequest request) {
        GeneratedQuizResponse quiz = geminiQuizService.generateQuiz(request);
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/generate-exam-questions")
    @Operation(summary = "Générer des questions pour un examen", description = "Génère des questions basées sur les champs de l'examen (titre, description, cours) via Gemini")
    public ResponseEntity<GeneratedQuizResponse> generateExamQuestions(
            @Valid @RequestBody ExamGenerateRequest request) {
        GeneratedQuizResponse result = geminiQuizService.generateExamQuestions(request);
        return ResponseEntity.ok(result);
    }
}
