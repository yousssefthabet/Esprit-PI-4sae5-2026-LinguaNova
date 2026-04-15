package linguaNova.examen_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import linguaNova.examen_service.dto.ExamGenerateRequest;
import linguaNova.examen_service.dto.GeneratedQuizResponse;
import linguaNova.examen_service.dto.QuizGenerateRequest;
import linguaNova.examen_service.service.GeminiQuizService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuizController.class)
class QuizControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    GeminiQuizService geminiQuizService;

    @Test
    void generateQuiz_returns200() throws Exception {
        QuizGenerateRequest req = new QuizGenerateRequest();
        req.setTopic("Grammar");
        req.setDifficulty("easy");
        req.setNumQuestions(5);

        GeneratedQuizResponse resp = new GeneratedQuizResponse("Quiz", List.of());
        when(geminiQuizService.generateQuiz(any(QuizGenerateRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/quiz/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Quiz"));

        verify(geminiQuizService).generateQuiz(any(QuizGenerateRequest.class));
    }

    @Test
    void generateQuiz_invalidBody_returns400() throws Exception {
        QuizGenerateRequest invalid = new QuizGenerateRequest();
        invalid.setTopic("");
        invalid.setDifficulty("");
        invalid.setNumQuestions(0);

        mockMvc.perform(post("/api/quiz/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(geminiQuizService);
    }

    @Test
    void generateExamQuestions_returns200() throws Exception {
        ExamGenerateRequest req = new ExamGenerateRequest();
        req.setTitle("Exam");
        req.setDescription("Une description assez longue");
        req.setCourseName("English");
        req.setDifficulty("medium");
        req.setNumQuestions(3);

        when(geminiQuizService.generateExamQuestions(any(ExamGenerateRequest.class)))
                .thenReturn(new GeneratedQuizResponse("Exam", List.of()));

        mockMvc.perform(post("/api/quiz/generate-exam-questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Exam"));

        verify(geminiQuizService).generateExamQuestions(any(ExamGenerateRequest.class));
    }
}

