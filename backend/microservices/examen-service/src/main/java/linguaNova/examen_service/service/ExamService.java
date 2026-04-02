package linguaNova.examen_service.service;

import linguaNova.examen_service.client.UserClient;
import linguaNova.examen_service.dto.ExamWithTeacherDTO;
import linguaNova.examen_service.dto.UserResponse;
import linguaNova.examen_service.entity.Exam;
import linguaNova.examen_service.entity.ExamStatus;
import linguaNova.examen_service.repository.ExamRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final UserClient userClient;

    public ExamService(ExamRepository examRepository, UserClient userClient) {
        this.examRepository = examRepository;
        this.userClient = userClient;
    }

    // Créer un examen
    public Exam createExam(Exam exam) {
        if (examRepository.existsByTitle(exam.getTitle())) {
            throw new RuntimeException("Un examen avec ce titre existe déjà");
        }
        double calculatedMaxScore = 0;
        if (exam.getQuestions() != null) {
            for (var question : exam.getQuestions()) {
                question.setExam(exam);
                if (question.getScore() != null) {
                    calculatedMaxScore += question.getScore();
                }
                if (question.getReponses() != null) {
                    for (var reponse : question.getReponses()) {
                        reponse.setQuestion(question);
                    }
                }
            }
        }
        if (exam.getMaxScore() == null || exam.getMaxScore() == 0) {
            exam.setMaxScore(calculatedMaxScore);
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

    /**
     * Récupérer un examen enrichi avec les infos du teacher depuis le user-service.
     */
    public ExamWithTeacherDTO getExamWithTeacher(Long examId) {
        Exam exam = getExamById(examId);
        UserResponse teacher = null;
        if (exam.getTeacherId() != null) {
            try {
                teacher = userClient.getUserById(exam.getTeacherId());
            } catch (Exception e) {
                // Le user-service est indisponible, on continue sans les infos teacher
            }
        }
        return ExamWithTeacherDTO.builder()
                .exam(exam)
                .teacher(teacher)
                .build();
    }

    /**
     * Récupérer tous les examens enrichis avec les infos du teacher.
     */
    public List<ExamWithTeacherDTO> getAllExamsWithTeacher() {
        return examRepository.findAll().stream()
                .map(exam -> {
                    UserResponse teacher = null;
                    if (exam.getTeacherId() != null) {
                        try {
                            teacher = userClient.getUserById(exam.getTeacherId());
                        } catch (Exception ignored) {}
                    }
                    return ExamWithTeacherDTO.builder().exam(exam).teacher(teacher).build();
                })
                .toList();
    }

    /**
     * Récupérer les examens d'un teacher par son userId.
     */
    public List<Exam> getExamsByTeacherId(Long teacherId) {
        return examRepository.findByTeacherId(teacherId);
    }

    // Mettre à jour un examen
    public Exam updateExam(Long id, Exam examDetails) {
        Exam exam = getExamById(id);
        if (examDetails.getTitle() != null) exam.setTitle(examDetails.getTitle());
        if (examDetails.getDescription() != null) exam.setDescription(examDetails.getDescription());
        if (examDetails.getExamStatus() != null) exam.setExamStatus(examDetails.getExamStatus());
        if (examDetails.getMaxScore() != null) exam.setMaxScore(examDetails.getMaxScore());
        if (examDetails.getCourseName() != null) exam.setCourseName(examDetails.getCourseName());
        if (examDetails.getTeacherId() != null) exam.setTeacherId(examDetails.getTeacherId());
        if (examDetails.getQuestions() != null) {
            if (exam.getQuestions() != null) exam.getQuestions().clear();
            else exam.setQuestions(new java.util.ArrayList<>());
            double calculatedMaxScore = 0;
            for (var question : examDetails.getQuestions()) {
                question.setExam(exam);
                if (question.getScore() != null) {
                    calculatedMaxScore += question.getScore();
                }
                if (question.getReponses() != null) {
                    for (var reponse : question.getReponses()) {
                        reponse.setQuestion(question);
                    }
                }
                exam.getQuestions().add(question);
            }
            if (examDetails.getMaxScore() == null || examDetails.getMaxScore() == 0) {
                exam.setMaxScore(calculatedMaxScore);
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

    // Publier un examen (DRAFT -> PUBLISHED)
    public Exam publishExam(Long id) {
        Exam exam = getExamById(id);
        if (exam.getExamStatus() != ExamStatus.DRAFT) {
            throw new RuntimeException("Impossible de publier l'examen tant qu'il n'est pas en DRAFT");
        }
        exam.setExamStatus(ExamStatus.PUBLISHED);
        return examRepository.save(exam);
    }

    // Clore un examen (PUBLISHED -> CLOSED)
    public Exam closeExam(Long id) {
        Exam exam = getExamById(id);
        if (exam.getExamStatus() != ExamStatus.PUBLISHED) {
            throw new RuntimeException("Impossible de clore l'examen sauf s'il est PUBLISHED");
        }
        exam.setExamStatus(ExamStatus.CLOSED);
        return examRepository.save(exam);
    }

}
