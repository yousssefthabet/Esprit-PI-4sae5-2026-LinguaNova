package linguaNova.examen_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import linguaNova.examen_service.entity.Question;
import linguaNova.examen_service.entity.QuestionType;
import linguaNova.examen_service.service.QuestionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuestionController.class)
class QuestionControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean
    QuestionService questionService;

    @Test
    void createQuestion_returns201() throws Exception {
        Question input = Question.builder()
                .content("Question content long")
                .score(2.0)
                .type(QuestionType.QCM)
                .build();

        Question created = Question.builder()
                .id(1L)
                .content(input.getContent())
                .score(input.getScore())
                .type(input.getType())
                .build();

        when(questionService.createQuestion(any(Question.class))).thenReturn(created);

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));

        verify(questionService).createQuestion(any(Question.class));
    }

    @Test
    void getQuestionById_whenNotFound_returns404() throws Exception {
        when(questionService.getQuestionById(50L)).thenThrow(new RuntimeException("not found"));

        mockMvc.perform(get("/api/questions/50"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getQuestionsByExamId_returns200() throws Exception {
        when(questionService.getQuestionsByExamId(3L)).thenReturn(List.of());

        mockMvc.perform(get("/api/questions/exam/3"))
                .andExpect(status().isOk());

        verify(questionService).getQuestionsByExamId(3L);
    }
}

