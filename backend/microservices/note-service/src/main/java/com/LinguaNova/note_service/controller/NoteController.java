package com.LinguaNova.note_service.controller;

import com.LinguaNova.note_service.dto.NoteCreateRequest;
import com.LinguaNova.note_service.dto.NoteResponse;
import com.LinguaNova.note_service.dto.NoteUpdateRequest;
import com.LinguaNova.note_service.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@Tag(name = "Notes", description = "API de gestion des notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    @Operation(summary = "Créer une note")
    public ResponseEntity<NoteResponse> create(@Valid @RequestBody NoteCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une note par ID")
    public ResponseEntity<NoteResponse> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(noteService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping
    @Operation(summary = "Lister les notes (filtrables par cahier)")
    public ResponseEntity<List<NoteResponse>> list(
            @RequestParam Long userId,
            @RequestParam(required = false) Long cahierId
    ) {
        return ResponseEntity.ok(noteService.list(userId, cahierId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier une note")
    public ResponseEntity<NoteResponse> update(@PathVariable Long id, @Valid @RequestBody NoteUpdateRequest request) {
        try {
            return ResponseEntity.ok(noteService.update(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une note")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            noteService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

