package linguaNova.examen_service.controller;

import linguaNova.examen_service.entity.Reponse;
import linguaNova.examen_service.service.ReponseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reponses")
@Tag(name = "Réponses", description = "API de gestion des réponses aux questions")
public class ReponseController {

    private final ReponseService reponseService;

    public ReponseController(ReponseService reponseService) {
        this.reponseService = reponseService;
    }

    // CREATE - Créer une nouvelle réponse
    @PostMapping
    public ResponseEntity<Reponse> createReponse(@Valid @RequestBody Reponse reponse) {
        Reponse createdReponse = reponseService.createReponse(reponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReponse);
    }

    // READ - Récupérer toutes les réponses
    @GetMapping
    public ResponseEntity<List<Reponse>> getAllReponses() {
        List<Reponse> reponses = reponseService.getAllReponses();
        return ResponseEntity.ok(reponses);
    }

    // READ - Récupérer une réponse par ID
    @GetMapping("/{id}")
    public ResponseEntity<Reponse> getReponseById(@PathVariable Long id) {
        try {
            Reponse reponse = reponseService.getReponseById(id);
            return ResponseEntity.ok(reponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // UPDATE - Mettre à jour une réponse
    @PutMapping("/{id}")
    public ResponseEntity<Reponse> updateReponse(@PathVariable Long id, @Valid @RequestBody Reponse reponse) {
        try {
            Reponse updatedReponse = reponseService.updateReponse(id, reponse);
            return ResponseEntity.ok(updatedReponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // DELETE - Supprimer une réponse
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReponse(@PathVariable Long id) {
        try {
            reponseService.deleteReponse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // FILTER - Récupérer les réponses par ID de question
    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Reponse>> getReponsesByQuestionId(@PathVariable Long questionId) {
        List<Reponse> reponses = reponseService.getReponsesByQuestionId(questionId);
        return ResponseEntity.ok(reponses);
    }

    // FILTER - Récupérer les réponses correctes par ID de question
    @GetMapping("/question/{questionId}/correct")
    public ResponseEntity<List<Reponse>> getCorrectReponsesByQuestionId(@PathVariable Long questionId) {
        List<Reponse> reponses = reponseService.getCorrectReponsesByQuestionId(questionId);
        return ResponseEntity.ok(reponses);
    }
}
