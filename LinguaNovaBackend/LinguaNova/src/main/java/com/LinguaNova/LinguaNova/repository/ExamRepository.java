package com.LinguaNova.LinguaNova.repository;

import com.LinguaNova.LinguaNova.entity.Exam;
import com.LinguaNova.LinguaNova.entity.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    @Override
    Optional<Exam> findById(Long id);

    @Override
    List<Exam> findAll();

    // Recherche par titre
    List<Exam> findByTitleContainingIgnoreCase(String title);

    // Recherche par statut
    List<Exam> findByExamStatus(ExamStatus status);

    // Recherche par nom de cours
    List<Exam> findByCourseName(String courseName);

    // Recherche par nom de cours et statut
    List<Exam> findByCourseNameAndExamStatus(String courseName, ExamStatus status);

    // Vérifier si un examen existe par titre
    boolean existsByTitle(String title);
}
