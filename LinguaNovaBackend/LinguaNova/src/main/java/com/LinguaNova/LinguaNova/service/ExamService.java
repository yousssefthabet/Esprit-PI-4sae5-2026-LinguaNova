package com.LinguaNova.LinguaNova.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.LinguaNova.LinguaNova.entity.Exam;
import com.LinguaNova.LinguaNova.entity.ExamStatus;
import com.LinguaNova.LinguaNova.repository.ExamRepository;

@Service
public class ExamService {

    private final ExamRepository examRepository;

    public ExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    // Créer un examen
    public Exam createExam(Exam exam) {
        if (examRepository.existsByTitle(exam.getTitle())) {
            throw new RuntimeException("Un examen avec ce titre existe déjà");
        }

        // Établir les relations bidirectionnelles
        if (exam.getQuestions() != null) {
            for (var question : exam.getQuestions()) {
                question.setExam(exam); // Lier la question à l'examen

                // Lier chaque réponse à sa question
                if (question.getReponses() != null) {
                    for (var reponse : question.getReponses()) {
                        reponse.setQuestion(question);
                    }
                }
            }
        }

        return examRepository.save(exam);
    }

    // Récupérer tous les examens
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    // Récupérer un examen par ID
    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'ID: " + id));
    }

    // Mettre à jour un examen
    public Exam updateExam(Long id, Exam examDetails) {
        Exam exam = getExamById(id);

        if (examDetails.getTitle() != null) {
            exam.setTitle(examDetails.getTitle());
        }
        if (examDetails.getDescription() != null) {
            exam.setDescription(examDetails.getDescription());
        }
        if (examDetails.getExamStatus() != null) {
            exam.setExamStatus(examDetails.getExamStatus());
        }
        if (examDetails.getMaxScore() != null) {
            exam.setMaxScore(examDetails.getMaxScore());
        }
        if (examDetails.getCourseName() != null) {
            exam.setCourseName(examDetails.getCourseName());
        }

        // Mettre à jour les questions et leurs réponses
        if (examDetails.getQuestions() != null) {
            // Supprimer les anciennes questions
            if (exam.getQuestions() != null) {
                exam.getQuestions().clear();
            } else {
                exam.setQuestions(new java.util.HashSet<>());
            }

            // Ajouter les nouvelles questions avec les relations
            for (var question : examDetails.getQuestions()) {
                question.setExam(exam);

                if (question.getReponses() != null) {
                    for (var reponse : question.getReponses()) {
                        reponse.setQuestion(question);
                    }
                }

                exam.getQuestions().add(question);
            }
        }

        return examRepository.save(exam);
    }

    // Supprimer un examen
    public void deleteExam(Long id) {
        if (!examRepository.existsById(id)) {
            throw new RuntimeException("Examen non trouvé avec l'ID: " + id);
        }
        examRepository.deleteById(id);
    }

    // Rechercher des examens par titre
    public List<Exam> searchExamsByTitle(String title) {
        return examRepository.findByTitleContainingIgnoreCase(title);
    }

    // Récupérer les examens par statut
    public List<Exam> getExamsByStatus(ExamStatus status) {
        return examRepository.findByExamStatus(status);
    }

    // Récupérer les examens par nom de cours
    public List<Exam> getExamsByCourseName(String courseName) {
        return examRepository.findByCourseName(courseName);
    }

    // Récupérer les examens par cours et statut
    public List<Exam> getExamsByCourseAndStatus(String courseName, ExamStatus status) {
        return examRepository.findByCourseNameAndExamStatus(courseName, status);
    }

    // Changer le statut d'un examen
    public Exam updateExamStatus(Long id, ExamStatus newStatus) {
        Exam exam = getExamById(id);
        exam.setExamStatus(newStatus);
        return examRepository.save(exam);
    }

    // Publier un examen (changer de DRAFT à PUBLISHED)
    public Exam publishExam(Long id) {
        Exam exam = getExamById(id);
        if (exam.getExamStatus() == ExamStatus.PUBLISHED) {
            throw new RuntimeException("L'examen est déjà publié");
        }
        exam.setExamStatus(ExamStatus.PUBLISHED);
        return examRepository.save(exam);
    }

    // Clore un examen
    public Exam closeExam(Long id) {
        Exam exam = getExamById(id);
        if (exam.getExamStatus() == ExamStatus.CLOSED) {
            throw new RuntimeException("L'examen est déjà clôturé");
        }
        exam.setExamStatus(ExamStatus.CLOSED);
        return examRepository.save(exam);
    }
}
