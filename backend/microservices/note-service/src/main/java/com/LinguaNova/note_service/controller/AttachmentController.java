package com.LinguaNova.note_service.controller;

import com.LinguaNova.note_service.dto.AttachmentResponse;
import com.LinguaNova.note_service.entity.Attachment;
import com.LinguaNova.note_service.entity.Note;
import com.LinguaNova.note_service.repository.AttachmentRepository;
import com.LinguaNova.note_service.repository.NoteRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/notes")
@Tag(name = "Note Attachments", description = "API pour gérer les pièces jointes des notes")
public class AttachmentController {

    private final AttachmentRepository attachmentRepository;
    private final NoteRepository noteRepository;

    public AttachmentController(AttachmentRepository attachmentRepository, NoteRepository noteRepository) {
        this.attachmentRepository = attachmentRepository;
        this.noteRepository = noteRepository;
    }

    @PostMapping("/{noteId}/attachments")
    @Operation(summary = "Ajouter une pièce jointe à une note")
    public ResponseEntity<AttachmentResponse> upload(
            @PathVariable Long noteId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedBy") Long uploadedBy
    ) {
        try {
            Note note = noteRepository.findById(noteId)
                    .orElseThrow(() -> new RuntimeException("Note non trouvée"));

            Attachment attachment = Attachment.builder()
                    .fileName(file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .size(file.getSize())
                    .data(file.getBytes())
                    .uploadedBy(uploadedBy)
                    .note(note)
                    .build();

            Attachment saved = attachmentRepository.save(attachment);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    AttachmentResponse.builder()
                            .id(saved.getId())
                            .fileName(saved.getFileName())
                            .contentType(saved.getContentType())
                            .size(saved.getSize())
                            .uploadedBy(saved.getUploadedBy())
                            .uploadedAt(saved.getUploadedAt())
                            .build()
            );
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/attachments/{id}/download")
    @Operation(summary = "Télécharger la pièce jointe")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pièce jointe non trouvée"));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\" ")
                .contentType(MediaType.parseMediaType(attachment.getContentType() != null ? attachment.getContentType() : "application/octet-stream"))
                .body(attachment.getData());
    }

    @DeleteMapping("/attachments/{id}")
    @Operation(summary = "Supprimer la pièce jointe")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!attachmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        attachmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
