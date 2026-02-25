package com.LinguaNova.LinguaNova.service;

import com.LinguaNova.LinguaNova.entity.StudentProfile;
import com.LinguaNova.LinguaNova.repository.StudentAnswerRepository;
import com.LinguaNova.LinguaNova.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileService(StudentProfileRepository studentProfileRepository) {
        this.studentProfileRepository = studentProfileRepository;
    }

    // Créer un profil étudiant
    public StudentProfile createStudentProfile(StudentProfile studentProfile) {
        return studentProfileRepository.save(studentProfile);
    }

    // Récupérer tous les profils étudiants
    public List<StudentProfile> getAllStudentProfiles() {
        return studentProfileRepository.findAll();
    }

    // Récupérer un profil étudiant par ID
    public StudentProfile getStudentProfileById(Long id) {
        return studentProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil étudiant non trouvé avec l'ID: " + id));
    }

    // Mettre à jour un profil étudiant
    public StudentProfile updateStudentProfile(Long id, StudentProfile studentProfileDetails) {
        StudentProfile studentProfile = getStudentProfileById(id);

        if (studentProfileDetails.getLastName() != null) {
            studentProfile.setLastName(studentProfileDetails.getLastName());
        }
        if (studentProfileDetails.getFirstName() != null) {
            studentProfile.setFirstName(studentProfileDetails.getFirstName());
        }
        if (studentProfileDetails.getPhone() != null) {
            studentProfile.setPhone(studentProfileDetails.getPhone());
        }
        if (studentProfileDetails.getBirthDate() != null) {
            studentProfile.setBirthDate(studentProfileDetails.getBirthDate());
        }

        return studentProfileRepository.save(studentProfile);
    }

    // Supprimer un profil étudiant
    public void deleteStudentProfile(Long id) {
        if (!studentProfileRepository.existsById(id)) {
            throw new RuntimeException("Profil étudiant non trouvé avec l'ID: " + id);
        }
        studentProfileRepository.deleteById(id);
    }
}

