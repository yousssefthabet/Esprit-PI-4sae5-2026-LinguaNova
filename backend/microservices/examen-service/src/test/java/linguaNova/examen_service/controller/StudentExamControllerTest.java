package linguaNova.examen_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import linguaNova.examen_service.entity.StudentExam;
import linguaNova.examen_service.service.StudentExamService;
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

@WebMvcTest(StudentExamController.class)
class StudentExamControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    StudentExamService studentExamService;

    @Test
    void createStudentExam_returns201() throws Exception {
        StudentExam input = new StudentExam();
        input.setUserId(5L);
        input.setScore(0.0);

        StudentExam created = new StudentExam();
        created.setId(1L);
        created.setUserId(5L);
        created.setScore(0.0);

        when(studentExamService.createStudentExam(any(StudentExam.class))).thenReturn(created);

        mockMvc.perform(post("/api/student-exams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));

        verify(studentExamService).createStudentExam(any(StudentExam.class));
    }

    @Test
    void getStudentExamById_whenNotFound_returns404() throws Exception {
        when(studentExamService.getStudentExamById(99L)).thenThrow(new RuntimeException("not found"));

        mockMvc.perform(get("/api/student-exams/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void submitExam_returns200() throws Exception {
        StudentExam input = new StudentExam();
        input.setUserId(1L);
        input.setScore(0.0);

        StudentExam submitted = new StudentExam();
        submitted.setId(10L);
        submitted.setUserId(1L);
        submitted.setScore(15.0);

        when(studentExamService.submitExam(any(StudentExam.class))).thenReturn(submitted);

        mockMvc.perform(post("/api/student-exams/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));

        verify(studentExamService).submitExam(any(StudentExam.class));
    }

    @Test
    void getStudentExamsByUserId_returns200() throws Exception {
        when(studentExamService.getStudentExamsByUserId(3L)).thenReturn(List.of());

        mockMvc.perform(get("/api/student-exams/user/3"))
                .andExpect(status().isOk());

        verify(studentExamService).getStudentExamsByUserId(3L);
    }
}

