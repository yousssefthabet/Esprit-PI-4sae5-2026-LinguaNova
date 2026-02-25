package com.LinguaNova.LinguaNova.controller;

import com.LinguaNova.LinguaNova.entity.StudentExam;
import com.LinguaNova.LinguaNova.service.QuestionService;
import com.LinguaNova.LinguaNova.service.StudentExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
            @Parameter(description = "ID de l'examen étudiant") @PathVariable("id") Long id) {
        try {
            StudentExam studentExam = studentExamService.getStudentExamById(id);
            return ResponseEntity.ok(studentExam);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Mettre à jour un examen étudiant")
    @PutMapping("/{id}")
    public ResponseEntity<StudentExam> updateStudentExam(@PathVariable("id") Long id,
            @Valid @RequestBody StudentExam studentExam) {
        try {
            StudentExam updatedStudentExam = studentExamService.updateStudentExam(id, studentExam);
            return ResponseEntity.ok(updatedStudentExam);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Supprimer un examen étudiant")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentExam(@PathVariable("id") Long id) {
        try {
            studentExamService.deleteStudentExam(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Récupérer les examens d'un étudiant", description = "Retourne tous les examens passés par un étudiant spécifique")
    @GetMapping("/student/{studentProfileId}")
    public ResponseEntity<List<StudentExam>> getStudentExamsByStudentProfileId(
            @Parameter(description = "ID du profil étudiant") @PathVariable("studentProfileId") Long studentProfileId) {
        List<StudentExam> studentExams = studentExamService.getStudentExamsByStudentProfileId(studentProfileId);
        return ResponseEntity.ok(studentExams);
    }

    @Operation(summary = "Récupérer les soumissions d'un examen", description = "Retourne toutes les soumissions pour un examen donné")
    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<StudentExam>> getStudentExamsByExamId(
            @Parameter(description = "ID de l'examen") @PathVariable("examId") Long examId) {
        List<StudentExam> studentExams = studentExamService.getStudentExamsByExamId(examId);
        return ResponseEntity.ok(studentExams);
    }

    @Operation(summary = "Soumettre un examen", description = "Soumet un examen avec calcul automatique du score pour les questions QCM et Vrai/Faux")
    @PostMapping("/submit")
    public ResponseEntity<StudentExam> submitExam(@Valid @RequestBody StudentExam studentExam) {
        StudentExam submittedExam = studentExamService.submitExam(studentExam);
        return ResponseEntity.ok(submittedExam);
    }
}
