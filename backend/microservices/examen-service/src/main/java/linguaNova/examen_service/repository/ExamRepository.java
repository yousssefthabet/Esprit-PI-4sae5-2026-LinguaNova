package linguaNova.examen_service.repository;

import linguaNova.examen_service.entity.Exam;
import linguaNova.examen_service.entity.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

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

    // Recherche par teacherId (référence au user-service)
    List<Exam> findByTeacherId(Long teacherId);
}
