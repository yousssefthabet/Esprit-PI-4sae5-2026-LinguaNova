package com.LinguaNova.note_service.controller;

import com.LinguaNova.note_service.entity.Attachment;
import com.LinguaNova.note_service.entity.Note;
import com.LinguaNova.note_service.repository.AttachmentRepository;
import com.LinguaNova.note_service.repository.NoteRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AttachmentController.class)
class AttachmentControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    AttachmentRepository attachmentRepository;

    @MockBean
    NoteRepository noteRepository;

    @Test
    void upload_returns201() throws Exception {
        Note note = Note.builder().id(5L).build();
        Mockito.when(noteRepository.findById(5L)).thenReturn(Optional.of(note));

        Attachment saved = Attachment.builder()
                .id(11L)
                .fileName("a.txt")
                .contentType("text/plain")
                .size(3L)
                .uploadedBy(99L)
                .note(note)
                .build();
        Mockito.when(attachmentRepository.save(any(Attachment.class))).thenReturn(saved);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "a.txt",
                "text/plain",
                "hey".getBytes(StandardCharsets.UTF_8)
        );

        mockMvc.perform(multipart("/api/notes/5/attachments")
                        .file(file)
                        .param("uploadedBy", "99"))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(11))
                .andExpect(jsonPath("$.fileName").value("a.txt"));
    }

    @Test
    void download_returns200_withBytesAndHeaders() throws Exception {
        Attachment attachment = Attachment.builder()
                .id(11L)
                .fileName("a.txt")
                .contentType("text/plain")
                .data("hey".getBytes(StandardCharsets.UTF_8))
                .build();

        Mockito.when(attachmentRepository.findById(11L)).thenReturn(Optional.of(attachment));

        mockMvc.perform(get("/api/notes/attachments/11/download"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("filename=\"a.txt\"")))
                .andExpect(content().contentType("text/plain"))
                .andExpect(content().bytes("hey".getBytes(StandardCharsets.UTF_8)));
    }

    @Test
    void delete_whenNotExists_returns404() throws Exception {
        Mockito.when(attachmentRepository.existsById(11L)).thenReturn(false);

        mockMvc.perform(delete("/api/notes/attachments/11"))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_whenExists_returns204() throws Exception {
        Mockito.when(attachmentRepository.existsById(11L)).thenReturn(true);

        mockMvc.perform(delete("/api/notes/attachments/11"))
                .andExpect(status().isNoContent());

        Mockito.verify(attachmentRepository).deleteById(11L);
    }
}
