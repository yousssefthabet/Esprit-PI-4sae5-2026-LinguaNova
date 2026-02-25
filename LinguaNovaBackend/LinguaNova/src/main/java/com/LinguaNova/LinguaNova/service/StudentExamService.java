package com.LinguaNova.LinguaNova.service;
import com.LinguaNova.LinguaNova.entity.Question;
import com.LinguaNova.LinguaNova.entity.QuestionType;
import com.LinguaNova.LinguaNova.entity.Reponse;
import com.LinguaNova.LinguaNova.entity.StudentAnswer;
import com.LinguaNova.LinguaNova.entity.StudentExam;
import com.LinguaNova.LinguaNova.entity.StudentProfile;
import com.LinguaNova.LinguaNova.entity.Exam;
import com.LinguaNova.LinguaNova.repository.QuestionRepository;
import com.LinguaNova.LinguaNova.repository.ReponseRepository;
import com.LinguaNova.LinguaNova.repository.StudentAnswerRepository;
import com.LinguaNova.LinguaNova.repository.StudentExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service

public class StudentExamService {

    private final StudentExamRepository studentExamRepository;
    private final QuestionRepository questionRepository;
    private final ReponseRepository reponseRepository;

    public StudentExamService(StudentExamRepository studentExamRepository,
                            QuestionRepository questionRepository,
                            ReponseRepository reponseRepository) {
        this.studentExamRepository = studentExamRepository;
        this.questionRepository = questionRepository;
        this.reponseRepository = reponseRepository;
    }

    // Créer un examen étudiant
    public StudentExam createStudentExam(StudentExam studentExam) {
        return studentExamRepository.save(studentExam);
    }

    // Récupérer tous les examens étudiants
    public List<StudentExam> getAllStudentExams() {
        return studentExamRepository.findAll();
    }

    // Récupérer un examen étudiant par ID
    public StudentExam getStudentExamById(Long id) {
        return studentExamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examen étudiant non trouvé avec l'ID: " + id));
    }

    // Mettre à jour un examen étudiant
    public StudentExam updateStudentExam(Long id, StudentExam studentExamDetails) {
        StudentExam studentExam = getStudentExamById(id);

        if (studentExamDetails.getScore() != null) {
            studentExam.setScore(studentExamDetails.getScore());
        }
        if (studentExamDetails.getSubmittedAt() != null) {
            studentExam.setSubmittedAt(studentExamDetails.getSubmittedAt());
        }
        if (studentExamDetails.getValidated() != null) {
            studentExam.setValidated(studentExamDetails.getValidated());
        }
        if (studentExamDetails.getStudentProfile() != null) {
            studentExam.setStudentProfile(studentExamDetails.getStudentProfile());
        }
        if (studentExamDetails.getExam() != null) {
            studentExam.setExam(studentExamDetails.getExam());
        }

        return studentExamRepository.save(studentExam);
    }

    // Supprimer un examen étudiant
    public void deleteStudentExam(Long id) {
        if (!studentExamRepository.existsById(id)) {
            throw new RuntimeException("Examen étudiant non trouvé avec l'ID: " + id);
        }
        studentExamRepository.deleteById(id);
    }

    // Récupérer les examens par profil étudiant
    public List<StudentExam> getStudentExamsByStudentProfile(StudentProfile studentProfile) {
        return studentExamRepository.findByStudentProfile(studentProfile);
    }

    // Récupérer les examens par ID de profil étudiant
    public List<StudentExam> getStudentExamsByStudentProfileId(Long studentProfileId) {
        return studentExamRepository.findByStudentProfileId(studentProfileId);
    }

    // Récupérer les examens par examen
    public List<StudentExam> getStudentExamsByExam(Exam exam) {
        return studentExamRepository.findByExam(exam);
    }

    // Récupérer les examens par ID d'examen
    public List<StudentExam> getStudentExamsByExamId(Long examId) {
        return studentExamRepository.findByExamId(examId);
    }

    // Soumettre un examen avec calcul automatique du score
    public StudentExam submitExam(StudentExam studentExam) {
        
        // Établir les relations bidirectionnelles
        if (studentExam.getAnswers() != null) {
            for (StudentAnswer answer : studentExam.getAnswers()) {
                answer.setStudentExam(studentExam); // Lier la réponse à l'examen étudiant
                
                // Charger la question complète depuis la base de données
                if (answer.getQuestion() != null && answer.getQuestion().getId() != null) {
                    Question fullQuestion = questionRepository.findById(answer.getQuestion().getId())
                        .orElseThrow(() -> new RuntimeException("Question non trouvée avec l'ID: " + answer.getQuestion().getId()));
                    answer.setQuestion(fullQuestion);
                }
                
                // Charger la réponse complète depuis la base de données
                if (answer.getSelectedReponse() != null && answer.getSelectedReponse().getId() != null) {
                    Reponse fullReponse = reponseRepository.findById(answer.getSelectedReponse().getId())
                        .orElseThrow(() -> new RuntimeException("Réponse non trouvée avec l'ID: " + answer.getSelectedReponse().getId()));
                    answer.setSelectedReponse(fullReponse);
                }
            }
        }

        double totalScore = 0;

        // Calculer le score pour chaque réponse
        for (StudentAnswer answer : studentExam.getAnswers()) {

            Question question = answer.getQuestion();
            
            System.out.println("=== Calcul score pour question ID: " + question.getId() + " ===");
            System.out.println("Type de question: " + question.getType());
            System.out.println("Score de la question: " + question.getScore());

            if (question.getType() == QuestionType.QCM ||
                    question.getType() == QuestionType.TRUE_FALSE) {

                if (answer.getSelectedReponse() != null) {
                    System.out.println("Réponse sélectionnée ID: " + answer.getSelectedReponse().getId());
                    System.out.println("Réponse correcte: " + answer.getSelectedReponse().getCorrect());
                    
                    if (answer.getSelectedReponse().getCorrect()) {
                        totalScore += question.getScore();
                        System.out.println("Points ajoutés: " + question.getScore());
                    }
                } else {
                    System.out.println("Aucune réponse sélectionnée");
                }
            }
            
            System.out.println("Score total actuel: " + totalScore);
        }

        System.out.println("=== Score final: " + totalScore + " ===");
        
        studentExam.setScore(totalScore);
        studentExam.setSubmittedAt(LocalDateTime.now());
        studentExam.setValidated(false); // Par défaut, non validé

        return studentExamRepository.save(studentExam);
    }
}
