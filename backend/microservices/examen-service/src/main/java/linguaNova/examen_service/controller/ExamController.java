package linguaNova.examen_service.controller;

import linguaNova.examen_service.entity.Exam;
import linguaNova.examen_service.entity.ExamStatus;
import linguaNova.examen_service.service.ExamService;
import linguaNova.examen_service.dto.ExamWithTeacherDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/exams")
@Tag(name = "Examens", description = "API de gestion des examens")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @Operation(summary = "Créer un nouvel examen", description = "Crée un nouvel examen avec les informations fournies")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Examen créé avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })

    @PostMapping
    public ResponseEntity<Exam> createExam(@Valid @RequestBody Exam exam) {
        Exam createdExam = examService.createExam(exam);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExam);
    }

    @Operation(summary = "Récupérer tous les examens", description = "Retourne la liste de tous les examens")
    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams() {
        List<Exam> exams = examService.getAllExams();
        return ResponseEntity.ok(exams);
    }

    @Operation(summary = "Récupérer un examen par ID", description = "Retourne les détails d'un examen spécifique")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Examen trouvé"),
        @ApiResponse(responseCode = "404", description = "Examen non trouvé")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(
        @Parameter(description = "ID de l'examen") @PathVariable Long id) {
        try {
            Exam exam = examService.getExamById(id);
            return ResponseEntity.ok(exam);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Mettre à jour un examen", description = "Met à jour les informations d'un examen existant")
    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(
        @Parameter(description = "ID de l'examen") @PathVariable Long id,
        @Valid @RequestBody Exam exam) {
        Exam updatedExam = examService.updateExam(id, exam);
        return ResponseEntity.ok(updatedExam);
    }

    @Operation(summary = "Supprimer un examen", description = "Supprime un examen par son ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        try {
            examService.deleteExam(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Rechercher des examens par titre", description = "Recherche des examens contenant le texte spécifié dans le titre")
    @GetMapping("/search")
    public ResponseEntity<List<Exam>> searchExamsByTitle(
        @Parameter(description = "Texte à rechercher dans le titre") @RequestParam String title) {
        List<Exam> exams = examService.searchExamsByTitle(title);
        return ResponseEntity.ok(exams);
    }

    @Operation(summary = "Filtrer les examens par statut", description = "Retourne tous les examens avec un statut spécifique")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Exam>> getExamsByStatus(@PathVariable ExamStatus status) {
        List<Exam> exams = examService.getExamsByStatus(status);
        return ResponseEntity.ok(exams);
    }

    @Operation(summary = "Filtrer par nom de cours")
    @GetMapping("/course/{courseName}")
    public ResponseEntity<List<Exam>> getExamsByCourseName(@PathVariable String courseName) {
        List<Exam> exams = examService.getExamsByCourseName(courseName);
        return ResponseEntity.ok(exams);
    }

    @Operation(summary = "Filtrer par cours et statut")
    @GetMapping("/course/{courseName}/status/{status}")
    public ResponseEntity<List<Exam>> getExamsByCourseAndStatus(
            @PathVariable String courseName,
            @PathVariable ExamStatus status) {
        List<Exam> exams = examService.getExamsByCourseAndStatus(courseName, status);
        return ResponseEntity.ok(exams);
    }

    @Operation(summary = "Changer le statut d'un examen")
    @PatchMapping("/{id}/status")
    public ResponseEntity<Exam> updateExamStatus(
            @PathVariable Long id,
            @RequestParam ExamStatus status) {
        try {
            Exam exam = examService.updateExamStatus(id, status);
            return ResponseEntity.ok(exam);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Publier un examen", description = "Change le statut d'un examen de DRAFT à PUBLISHED")
    @PostMapping("/{id}/publish")
    public ResponseEntity<Exam> publishExam(@PathVariable Long id) {
        try {
            Exam exam = examService.publishExam(id);
            return ResponseEntity.ok(exam);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @Operation(summary = "Clore un examen", description = "Change le statut d'un examen à CLOSED")
    @PostMapping("/{id}/close")
    public ResponseEntity<Exam> closeExam(@PathVariable Long id) {
        try {
            Exam exam = examService.closeExam(id);
            return ResponseEntity.ok(exam);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @Operation(summary = "Récupérer un examen enrichi avec les infos du teacher")
    @GetMapping("/{id}/with-teacher")
    public ResponseEntity<ExamWithTeacherDTO> getExamWithTeacher(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(examService.getExamWithTeacher(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Récupérer tous les examens enrichis avec les infos du teacher")
    @GetMapping("/with-teacher")
    public ResponseEntity<List<ExamWithTeacherDTO>> getAllExamsWithTeacher() {
        return ResponseEntity.ok(examService.getAllExamsWithTeacher());
    }

    @Operation(summary = "Récupérer les examens d'un teacher par son userId")
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Exam>> getExamsByTeacherId(@PathVariable Long teacherId) {
        return ResponseEntity.ok(examService.getExamsByTeacherId(teacherId));
    }
}
