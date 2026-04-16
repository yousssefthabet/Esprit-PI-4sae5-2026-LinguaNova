package com.LinguaNova.note_service.controller;

import com.LinguaNova.note_service.dto.NoteCreateRequest;
import com.LinguaNova.note_service.dto.NoteResponse;
import com.LinguaNova.note_service.dto.NoteUpdateRequest;
import com.LinguaNova.note_service.entity.NoteContextType;
import com.LinguaNova.note_service.service.NoteService;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NoteController.class)
class NoteControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    NoteService noteService;

    @Test
    void create_returns201_andBody() throws Exception {
        NoteResponse response = NoteResponse.builder()
                .id(1L)
                .title("Titre")
                .content("Contenu")
                .cahierId(10L)
                .cahierNom("Mon cahier")
                .contextType(NoteContextType.COURSE)
                .userId(99L)
                .attachments(List.of())
                .build();

        Mockito.when(noteService.create(any(NoteCreateRequest.class))).thenReturn(response);

        NoteCreateRequest req = new NoteCreateRequest();
        req.setTitle("Titre");
        req.setContent("Contenu");
        req.setUserId(99L);
        req.setCahierId(10L);

        mockMvc.perform(post("/api/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.content").value("Contenu"));
    }

    @Test
    void create_whenInvalid_returns400() throws Exception {
        // content manquant + userId/cahierId manquants
        mockMvc.perform(post("/api/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getById_whenFound_returns200() throws Exception {
        NoteResponse response = NoteResponse.builder()
                .id(1L)
                .title("Titre")
                .content("Contenu")
                .cahierId(10L)
                .userId(99L)
                .attachments(List.of())
                .build();

        Mockito.when(noteService.getById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/notes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void getById_whenNotFound_returns404() throws Exception {
        Mockito.when(noteService.getById(1L)).thenThrow(new RuntimeException("not found"));

        mockMvc.perform(get("/api/notes/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void list_returns200() throws Exception {
        Mockito.when(noteService.list(eq(99L), isNull())).thenReturn(List.of(
                NoteResponse.builder().id(1L).content("A").userId(99L).attachments(List.of()).build(),
                NoteResponse.builder().id(2L).content("B").userId(99L).attachments(List.of()).build()
        ));

        mockMvc.perform(get("/api/notes")
                        .param("userId", "99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void update_whenFound_returns200() throws Exception {
        NoteResponse response = NoteResponse.builder()
                .id(1L)
                .title("T")
                .content("Nouveau")
                .cahierId(10L)
                .userId(99L)
                .attachments(List.of())
                .build();

        Mockito.when(noteService.update(eq(1L), any(NoteUpdateRequest.class))).thenReturn(response);

        NoteUpdateRequest req = new NoteUpdateRequest();
        req.setContent("Nouveau");

        mockMvc.perform(put("/api/notes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Nouveau"));
    }

    @Test
    void update_whenNotFound_returns404() throws Exception {
        Mockito.when(noteService.update(eq(1L), any(NoteUpdateRequest.class))).thenThrow(new RuntimeException("not found"));

        NoteUpdateRequest req = new NoteUpdateRequest();
        req.setContent("Nouveau");

        mockMvc.perform(put("/api/notes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_whenFound_returns204() throws Exception {
        mockMvc.perform(delete("/api/notes/1"))
                .andExpect(status().isNoContent());

        Mockito.verify(noteService).delete(1L);
    }

    @Test
    void delete_whenNotFound_returns404() throws Exception {
        Mockito.doThrow(new RuntimeException("not found")).when(noteService).delete(1L);

        mockMvc.perform(delete("/api/notes/1"))
                .andExpect(status().isNotFound());
    }
}
