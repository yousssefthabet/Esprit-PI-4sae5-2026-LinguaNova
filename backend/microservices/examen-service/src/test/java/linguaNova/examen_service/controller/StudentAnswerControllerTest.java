package linguaNova.examen_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import linguaNova.examen_service.entity.StudentAnswer;
import linguaNova.examen_service.service.StudentAnswerService;
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

@WebMvcTest(StudentAnswerController.class)
class StudentAnswerControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    StudentAnswerService studentAnswerService;

    @Test
    void createStudentAnswer_returns201() throws Exception {
        StudentAnswer input = new StudentAnswer();
        input.setTextAnswer("hello");

        StudentAnswer created = new StudentAnswer();
        created.setId(1L);
        created.setTextAnswer("hello");

        when(studentAnswerService.createStudentAnswer(any(StudentAnswer.class))).thenReturn(created);

        mockMvc.perform(post("/api/student-answers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));

        verify(studentAnswerService).createStudentAnswer(any(StudentAnswer.class));
    }

    @Test
    void getStudentAnswerById_whenNotFound_returns404() throws Exception {
        when(studentAnswerService.getStudentAnswerById(9L)).thenThrow(new RuntimeException("not found"));

        mockMvc.perform(get("/api/student-answers/9"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllStudentAnswers_returns200() throws Exception {
        when(studentAnswerService.getAllStudentAnswers()).thenReturn(List.of());

        mockMvc.perform(get("/api/student-answers"))
                .andExpect(status().isOk());

        verify(studentAnswerService).getAllStudentAnswers();
    }
}

