package linguaNova.examen_service.service;

import linguaNova.examen_service.entity.StudentAnswer;
import linguaNova.examen_service.repository.StudentAnswerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAnswerService {

    private final StudentAnswerRepository studentAnswerRepository;

    public StudentAnswerService(StudentAnswerRepository studentAnswerRepository) {
        this.studentAnswerRepository = studentAnswerRepository;
    }

    // Créer une réponse d'étudiant
    public StudentAnswer createStudentAnswer(StudentAnswer studentAnswer) {
        return studentAnswerRepository.save(studentAnswer);
    }

    // Récupérer toutes les réponses d'étudiants
    public List<StudentAnswer> getAllStudentAnswers() {
        return studentAnswerRepository.findAll();
    }

    // Récupérer une réponse d'étudiant par ID
    public StudentAnswer getStudentAnswerById(Long id) {
        return studentAnswerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réponse d'étudiant non trouvée avec l'ID: " + id));
    }

    // Mettre à jour une réponse d'étudiant
    public StudentAnswer updateStudentAnswer(Long id, StudentAnswer studentAnswerDetails) {
        StudentAnswer studentAnswer = getStudentAnswerById(id);

        if (studentAnswerDetails.getTextAnswer() != null) {
            studentAnswer.setTextAnswer(studentAnswerDetails.getTextAnswer());
        }
        if (studentAnswerDetails.getTeacherComment() != null) {
            studentAnswer.setTeacherComment(studentAnswerDetails.getTeacherComment());
        }
        if (studentAnswerDetails.getSelectedReponse() != null) {
            studentAnswer.setSelectedReponse(studentAnswerDetails.getSelectedReponse());
        }
        if (studentAnswerDetails.getStudentExam() != null) {
            studentAnswer.setStudentExam(studentAnswerDetails.getStudentExam());
        }
        if (studentAnswerDetails.getQuestion() != null) {
            studentAnswer.setQuestion(studentAnswerDetails.getQuestion());
        }

        return studentAnswerRepository.save(studentAnswer);
    }

    // Supprimer une réponse d'étudiant
    public void deleteStudentAnswer(Long id) {
        if (!studentAnswerRepository.existsById(id)) {
            throw new RuntimeException("Réponse d'étudiant non trouvée avec l'ID: " + id);
        }
        studentAnswerRepository.deleteById(id);
    }
}
