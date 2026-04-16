package linguaNova.examen_service.controller;

import linguaNova.examen_service.entity.StudentAnswer;
import linguaNova.examen_service.service.StudentAnswerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-answers")
@Tag(name = "Réponses Étudiants", description = "API de gestion des réponses des étudiants")
public class StudentAnswerController {

    private final StudentAnswerService studentAnswerService;
    public StudentAnswerController(StudentAnswerService studentAnswerService) {
        this.studentAnswerService = studentAnswerService;
    }

    // CREATE - Créer une nouvelle réponse d'étudiant
    @PostMapping
    public ResponseEntity<StudentAnswer> createStudentAnswer(@Valid @RequestBody StudentAnswer studentAnswer) {
        StudentAnswer createdAnswer = studentAnswerService.createStudentAnswer(studentAnswer);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAnswer);
    }

    // READ - Récupérer toutes les réponses d'étudiants
    @GetMapping
    public ResponseEntity<List<StudentAnswer>> getAllStudentAnswers() {
        List<StudentAnswer> answers = studentAnswerService.getAllStudentAnswers();
        return ResponseEntity.ok(answers);
    }

    // READ - Récupérer une réponse d'étudiant par ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentAnswer> getStudentAnswerById(@PathVariable Long id) {
        try {
            StudentAnswer answer = studentAnswerService.getStudentAnswerById(id);
            return ResponseEntity.ok(answer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // UPDATE - Mettre à jour une réponse d'étudiant
    @PutMapping("/{id}")
    public ResponseEntity<StudentAnswer> updateStudentAnswer(@PathVariable Long id, @Valid @RequestBody StudentAnswer studentAnswer) {
        try {
            StudentAnswer updatedAnswer = studentAnswerService.updateStudentAnswer(id, studentAnswer);
            return ResponseEntity.ok(updatedAnswer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // DELETE - Supprimer une réponse d'étudiant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentAnswer(@PathVariable Long id) {
        try {
            studentAnswerService.deleteStudentAnswer(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
