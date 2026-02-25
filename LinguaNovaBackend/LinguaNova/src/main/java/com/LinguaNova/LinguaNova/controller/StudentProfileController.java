package com.LinguaNova.LinguaNova.controller;

import com.LinguaNova.LinguaNova.entity.StudentProfile;
import com.LinguaNova.LinguaNova.service.QuestionService;
import com.LinguaNova.LinguaNova.service.StudentProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-profiles")
@Tag(name = "Profils Étudiants", description = "API de gestion des profils étudiants")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    // CREATE - Créer un nouveau profil étudiant
    @PostMapping
    public ResponseEntity<StudentProfile> createStudentProfile(@Valid @RequestBody StudentProfile studentProfile) {
        StudentProfile createdProfile = studentProfileService.createStudentProfile(studentProfile);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProfile);
    }

    // READ - Récupérer tous les profils étudiants
    @GetMapping
    public ResponseEntity<List<StudentProfile>> getAllStudentProfiles() {
        List<StudentProfile> profiles = studentProfileService.getAllStudentProfiles();
        return ResponseEntity.ok(profiles);
    }

    // READ - Récupérer un profil étudiant par ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentProfile> getStudentProfileById(@PathVariable("id") Long id) {
        try {
            StudentProfile profile = studentProfileService.getStudentProfileById(id);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // UPDATE - Mettre à jour un profil étudiant
    @PutMapping("/{id}")
    public ResponseEntity<StudentProfile> updateStudentProfile(@PathVariable("id") Long id,
            @Valid @RequestBody StudentProfile studentProfile) {
        try {
            StudentProfile updatedProfile = studentProfileService.updateStudentProfile(id, studentProfile);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // DELETE - Supprimer un profil étudiant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentProfile(@PathVariable("id") Long id) {
        try {
            studentProfileService.deleteStudentProfile(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
