package linguaNova.examen_service.controller;

import linguaNova.examen_service.entity.StudentExam;
import linguaNova.examen_service.service.StudentExamService;
import linguaNova.examen_service.dto.StudentExamWithUserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-exams")
@Tag(name = "Examens Étudiants", description = "API de gestion des examens passés par les étudiants")
public class StudentExamController {

    private final StudentExamService studentExamService;
    public StudentExamController(StudentExamService studentExamService) {
        this.studentExamService = studentExamService;
    }

    @Operation(summary = "Créer un nouvel examen étudiant")
    @PostMapping
    public ResponseEntity<StudentExam> createStudentExam(@Valid @RequestBody StudentExam studentExam) {
        StudentExam createdStudentExam = studentExamService.createStudentExam(studentExam);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudentExam);
    }

    @Operation(summary = "Récupérer tous les examens étudiants")
    @GetMapping
    public ResponseEntity<List<StudentExam>> getAllStudentExams() {
        List<StudentExam> studentExams = studentExamService.getAllStudentExams();
        return ResponseEntity.ok(studentExams);
    }

    @Operation(summary = "Récupérer un examen étudiant par ID")
    @GetMapping("/{id}")
    public ResponseEntity<StudentExam> getStudentExamById(
        @Parameter(description = "ID de l'examen étudiant") @PathVariable Long id) {
        try {
            StudentExam studentExam = studentExamService.getStudentExamById(id);
            return ResponseEntity.ok(studentExam);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Mettre à jour un examen étudiant")
    @PutMapping("/{id}")
    public ResponseEntity<StudentExam> updateStudentExam(@PathVariable Long id, @Valid @RequestBody StudentExam studentExam) {
        try {
            StudentExam updatedStudentExam = studentExamService.updateStudentExam(id, studentExam);
            return ResponseEntity.ok(updatedStudentExam);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Supprimer un examen étudiant")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentExam(@PathVariable Long id) {
        try {
            studentExamService.deleteStudentExam(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Récupérer les examens d'un étudiant via userId")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudentExam>> getStudentExamsByUserId(
        @Parameter(description = "ID user-service de l'étudiant") @PathVariable Long userId) {
        List<StudentExam> studentExams = studentExamService.getStudentExamsByUserId(userId);
        return ResponseEntity.ok(studentExams);
    }

    @Operation(summary = "Récupérer les soumissions d'un examen", description = "Retourne toutes les soumissions pour un examen donné")
    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<StudentExam>> getStudentExamsByExamId(
        @Parameter(description = "ID de l'examen") @PathVariable Long examId) {
        List<StudentExam> studentExams = studentExamService.getStudentExamsByExamId(examId);
        return ResponseEntity.ok(studentExams);
    }

    @Operation(summary = "Récupérer les soumissions d'un examen avec détails user")
    @GetMapping("/exam/{examId}/with-details")
    public ResponseEntity<List<StudentExamWithUserDTO>> getStudentExamsByExamIdWithDetails(
        @Parameter(description = "ID de l'examen") @PathVariable Long examId) {
        return ResponseEntity.ok(studentExamService.getStudentExamsByExamIdWithDetails(examId));
    }

    @Operation(summary = "Soumettre un examen", description = "Soumet un examen avec calcul automatique du score pour les questions QCM et Vrai/Faux")
    @PostMapping("/submit")
    public ResponseEntity<StudentExam> submitExam(@Valid @RequestBody StudentExam studentExam) {
        StudentExam submittedExam = studentExamService.submitExam(studentExam);
        return ResponseEntity.ok(submittedExam);
    }

    @Operation(summary = "Récupérer un examen étudiant enrichi avec les infos student et teacher")
    @GetMapping("/{id}/with-users")
    public ResponseEntity<StudentExamWithUserDTO> getStudentExamWithUsers(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(studentExamService.getStudentExamWithUsers(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Récupérer tous les examens d'un étudiant via son userId (user-service)")
    @GetMapping("/by-user/{userId}/with-details")
    public ResponseEntity<List<StudentExamWithUserDTO>> getStudentExamsByUserIdWithDetails(@PathVariable Long userId) {
        return ResponseEntity.ok(studentExamService.getStudentExamsByUserIdWithDetails(userId));
    }
}
