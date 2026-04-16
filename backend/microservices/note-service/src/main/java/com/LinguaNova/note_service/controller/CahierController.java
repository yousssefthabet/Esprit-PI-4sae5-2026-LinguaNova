package com.LinguaNova.note_service.controller;

import com.LinguaNova.note_service.dto.CahierCreateRequest;
import com.LinguaNova.note_service.dto.CahierResponse;
import com.LinguaNova.note_service.entity.NoteContextType;
import com.LinguaNova.note_service.service.CahierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cahiers")
@Tag(name = "Cahiers", description = "API de gestion des cahiers de notes")
public class CahierController {

    private final CahierService cahierService;

    public CahierController(CahierService cahierService) {
        this.cahierService = cahierService;
    }

    @PostMapping
    @Operation(summary = "Créer un cahier")
    public ResponseEntity<CahierResponse> create(@Valid @RequestBody CahierCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cahierService.create(request));
    }

    @GetMapping
    @Operation(summary = "Lister les cahiers")
    public ResponseEntity<List<CahierResponse>> list(
            @RequestParam Long userId,
            @RequestParam(required = false) NoteContextType contextType
    ) {
        return ResponseEntity.ok(cahierService.list(userId, contextType));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un cahier")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cahierService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un cahier")
    public ResponseEntity<CahierResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cahierService.getById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un cahier")
    public ResponseEntity<CahierResponse> update(@PathVariable Long id, @Valid @RequestBody CahierCreateRequest request) {
        return ResponseEntity.ok(cahierService.update(id, request));
    }
}

