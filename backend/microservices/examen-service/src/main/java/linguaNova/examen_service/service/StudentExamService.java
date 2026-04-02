package linguaNova.examen_service.service;

import linguaNova.examen_service.client.UserClient;
import linguaNova.examen_service.dto.StudentExamWithUserDTO;
import linguaNova.examen_service.dto.UserResponse;
import linguaNova.examen_service.entity.*;
import linguaNova.examen_service.repository.QuestionRepository;
import linguaNova.examen_service.repository.ReponseRepository;
import linguaNova.examen_service.repository.StudentExamRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudentExamService {

    private final StudentExamRepository studentExamRepository;
    private final QuestionRepository questionRepository;
    private final ReponseRepository reponseRepository;
    private final UserClient userClient;
    private final CertificateService certificateService;

    public StudentExamService(StudentExamRepository studentExamRepository,
                              QuestionRepository questionRepository,
                              ReponseRepository reponseRepository,
                              UserClient userClient,
                              CertificateService certificateService) {
        this.studentExamRepository = studentExamRepository;
        this.questionRepository = questionRepository;
        this.reponseRepository = reponseRepository;
        this.userClient = userClient;
        this.certificateService = certificateService;
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
        if (studentExamDetails.getUserId() != null) {
            studentExam.setUserId(studentExamDetails.getUserId());
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

    // Récupérer les examens par userId (user-service)
    public List<StudentExam> getStudentExamsByUserId(Long userId) {
        return studentExamRepository.findByUserId(userId);
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
        
        // Auto-validate if all questions are auto-graded
        boolean allAutoGraded = studentExam.getAnswers() != null && studentExam.getAnswers().stream()
            .allMatch(a -> a.getQuestion() != null && 
                           (a.getQuestion().getType() == QuestionType.QCM || a.getQuestion().getType() == QuestionType.TRUE_FALSE));
                           
        studentExam.setValidated(allAutoGraded);

        if (studentExam.getUserId() == null) {
            throw new RuntimeException("StudentExam sans userId");
        }

        StudentExam savedExam = studentExamRepository.save(studentExam);

        try {
            certificateService.generateIfEligible(savedExam.getId());
        } catch (Exception ignored) {
            // L'echec de generation du certificat ne doit pas empecher la soumission.
        }

        return savedExam;
    }

    /**
     * Récupérer un StudentExam enrichi avec les infos étudiant et teacher depuis le user-service.
     */
    public StudentExamWithUserDTO getStudentExamWithUsers(Long studentExamId) {
        StudentExam studentExam = getStudentExamById(studentExamId);

        UserResponse student = null;
        Long studentUserId = studentExam.getUserId();
        if (studentUserId != null) {
            try {
                student = userClient.getUserById(studentUserId);
            } catch (Exception ignored) {}
        }

        UserResponse teacher = null;
        if (studentExam.getExam() != null && studentExam.getExam().getTeacherId() != null) {
            try {
                teacher = userClient.getUserById(studentExam.getExam().getTeacherId());
            } catch (Exception ignored) {}
        }

        return StudentExamWithUserDTO.builder()
                .studentExam(studentExam)
                .student(student)
                .teacher(teacher)
                .build();
    }

    /**
     * Récupérer tous les StudentExams d'un étudiant (via userId) enrichis avec ses infos user.
     */
    public List<StudentExamWithUserDTO> getStudentExamsByUserIdWithDetails(Long userId) {
        return studentExamRepository.findByUserId(userId).stream()
                .map(se -> {
                    UserResponse student = null;
                    try { student = userClient.getUserById(userId); } catch (Exception ignored) {}
                    UserResponse teacher = null;
                    if (se.getExam() != null && se.getExam().getTeacherId() != null) {
                        try { teacher = userClient.getUserById(se.getExam().getTeacherId()); } catch (Exception ignored) {}
                    }
                    return StudentExamWithUserDTO.builder()
                            .studentExam(se)
                            .student(student)
                            .teacher(teacher)
                            .build();
                })
                .toList();
    }

    /**
     * Récupérer toutes les soumissions d'un examen, enrichies avec les infos user étudiant.
     */
    public List<StudentExamWithUserDTO> getStudentExamsByExamIdWithDetails(Long examId) {
        return studentExamRepository.findByExamId(examId).stream()
                .map(se -> {
                    UserResponse student = null;
                    if (se.getUserId() != null) {
                        try { student = userClient.getUserById(se.getUserId()); } catch (Exception ignored) {}
                    }
                    UserResponse teacher = null;
                    if (se.getExam() != null && se.getExam().getTeacherId() != null) {
                        try { teacher = userClient.getUserById(se.getExam().getTeacherId()); } catch (Exception ignored) {}
                    }
                    return StudentExamWithUserDTO.builder()
                            .studentExam(se)
                            .student(student)
                            .teacher(teacher)
                            .build();
                })
                .toList();
    }
}
