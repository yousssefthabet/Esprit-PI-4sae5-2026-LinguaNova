package linguaNova.examen_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import linguaNova.examen_service.entity.Reponse;
import linguaNova.examen_service.service.ReponseService;
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


@WebMvcTest(ReponseController.class)
class ReponseControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean
    ReponseService reponseService;

    @Test
    void createReponse_returns201() throws Exception {
        Reponse input = Reponse.builder()
                .content("A")
                .correct(true)
                .build();
        Reponse created = Reponse.builder().id(1L).content("A").correct(true).build();

        when(reponseService.createReponse(any(Reponse.class))).thenReturn(created);

        mockMvc.perform(post("/api/reponses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));

        verify(reponseService).createReponse(any(Reponse.class));
    }

    @Test
    void getReponseById_whenNotFound_returns404() throws Exception {
        when(reponseService.getReponseById(10L)).thenThrow(new RuntimeException("not found"));

        mockMvc.perform(get("/api/reponses/10"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getCorrectReponsesByQuestionId_returns200() throws Exception {
        when(reponseService.getCorrectReponsesByQuestionId(7L)).thenReturn(List.of());

        mockMvc.perform(get("/api/reponses/question/7/correct"))
                .andExpect(status().isOk());

        verify(reponseService).getCorrectReponsesByQuestionId(7L);
    }
}

