package linguaNova.examen_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import linguaNova.examen_service.dto.ExamWithTeacherDTO;
import linguaNova.examen_service.entity.Exam;
import linguaNova.examen_service.entity.ExamStatus;
import linguaNova.examen_service.service.ExamService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExamController.class)
class ExamControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean
    ExamService examService;

    @Test
    void createExam_returns201() throws Exception {
        Exam input = Exam.builder()
                .title("Midterm")
                .description("Description assez longue")
                .examStatus(ExamStatus.DRAFT)
                .maxScore(20.0)
                .courseName("English")
                .teacherId(10L)
                .build();

        Exam created = Exam.builder()
                .id(1L)
                .title(input.getTitle())
                .description(input.getDescription())
                .examStatus(input.getExamStatus())
                .maxScore(input.getMaxScore())
                .courseName(input.getCourseName())
                .teacherId(input.getTeacherId())
                .build();

        when(examService.createExam(any(Exam.class))).thenReturn(created);

        mockMvc.perform(post("/api/exams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1));

        verify(examService).createExam(any(Exam.class));
    }

    @Test
    void createExam_invalidBody_returns400() throws Exception {
        Exam invalid = Exam.builder()
                .title("")
                .description("short")
                .examStatus(null)
                .maxScore(-1.0)
                .courseName("")
                .build();

        mockMvc.perform(post("/api/exams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(examService);
    }

    @Test
    void getExamById_whenServiceThrows_returns404() throws Exception {
        when(examService.getExamById(99L)).thenThrow(new RuntimeException("not found"));

        mockMvc.perform(get("/api/exams/99"))
                .andExpect(status().isNotFound());

        verify(examService).getExamById(99L);
    }

    @Test
    void searchExamsByTitle_returns200() throws Exception {
        when(examService.searchExamsByTitle("mid")).thenReturn(List.of());

        mockMvc.perform(get("/api/exams/search").param("title", "mid"))
                .andExpect(status().isOk());

        verify(examService).searchExamsByTitle("mid");
    }

    @Test
    void updateExamStatus_returns200() throws Exception {
        Exam updated = Exam.builder()
                .id(5L)
                .title("T")
                .description("Description assez longue")
                .examStatus(ExamStatus.PUBLISHED)
                .maxScore(10.0)
                .courseName("C")
                .build();

        when(examService.updateExamStatus(5L, ExamStatus.PUBLISHED)).thenReturn(updated);

        mockMvc.perform(patch("/api/exams/5/status").param("status", "PUBLISHED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.examStatus").value("PUBLISHED"));

        verify(examService).updateExamStatus(5L, ExamStatus.PUBLISHED);
    }

    @Test
    void getExamWithTeacher_returns200() throws Exception {
        ExamWithTeacherDTO dto = ExamWithTeacherDTO.builder().exam(Exam.builder().id(1L).build()).teacher(null).build();
        when(examService.getExamWithTeacher(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/exams/1/with-teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exam.id").value(1));

        verify(examService).getExamWithTeacher(1L);
    }
}

