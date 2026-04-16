package com.LinguaNova.note_service.controller;

import com.LinguaNova.note_service.dto.CahierCreateRequest;
import com.LinguaNova.note_service.dto.CahierResponse;
import com.LinguaNova.note_service.entity.NoteContextType;
import com.LinguaNova.note_service.service.CahierService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CahierController.class)
class CahierControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    CahierService cahierService;

    @Test
    void create_returns201() throws Exception {
        CahierResponse response = CahierResponse.builder()
                .idCahier(1L)
                .nomContexte("Java")
                .contextType(NoteContextType.COURSE)
                .userId(99L)
                .build();

        Mockito.when(cahierService.create(any(CahierCreateRequest.class))).thenReturn(response);

        CahierCreateRequest req = new CahierCreateRequest();
        req.setNomContexte("Java");
        req.setContextType(NoteContextType.COURSE);
        req.setUserId(99L);

        mockMvc.perform(post("/api/cahiers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idCahier").value(1));
    }

    @Test
    void create_whenInvalid_returns400() throws Exception {
        mockMvc.perform(post("/api/cahiers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void list_withoutContextType_returns200() throws Exception {
        Mockito.when(cahierService.list(eq(99L), isNull()))
                .thenReturn(List.of(CahierResponse.builder().idCahier(1L).nomContexte("Java").contextType(NoteContextType.COURSE).userId(99L).build()));

        mockMvc.perform(get("/api/cahiers")
                        .param("userId", "99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idCahier").value(1));
    }

    @Test
    void list_withContextType_returns200() throws Exception {
        Mockito.when(cahierService.list(eq(99L), eq(NoteContextType.COURSE)))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/cahiers")
                        .param("userId", "99")
                        .param("contextType", "COURSE"))
                .andExpect(status().isOk());
    }

    @Test
    void delete_returns204() throws Exception {
        mockMvc.perform(delete("/api/cahiers/1"))
                .andExpect(status().isNoContent());

        Mockito.verify(cahierService).delete(1L);
    }

    @Test
    void getById_returns200() throws Exception {
        Mockito.when(cahierService.getById(1L)).thenReturn(
                CahierResponse.builder().idCahier(1L).nomContexte("Java").contextType(NoteContextType.COURSE).userId(99L).build()
        );

        mockMvc.perform(get("/api/cahiers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idCahier").value(1));
    }

    @Test
    void update_returns200() throws Exception {
        Mockito.when(cahierService.update(eq(1L), any(CahierCreateRequest.class))).thenReturn(
                CahierResponse.builder().idCahier(1L).nomContexte("Algo").contextType(NoteContextType.COURSE).userId(99L).build()
        );

        CahierCreateRequest req = new CahierCreateRequest();
        req.setNomContexte("Algo");
        req.setContextType(NoteContextType.COURSE);
        req.setUserId(99L);

        mockMvc.perform(put("/api/cahiers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomContexte").value("Algo"));
    }
}

