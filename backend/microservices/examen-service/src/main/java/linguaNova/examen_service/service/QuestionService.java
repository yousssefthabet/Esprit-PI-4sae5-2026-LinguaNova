package linguaNova.examen_service.service;

import linguaNova.examen_service.entity.Exam;
import linguaNova.examen_service.entity.Question;
import linguaNova.examen_service.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;


    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }
    // Créer une question
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    // Récupérer toutes les questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // Récupérer une question par ID
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question non trouvée avec l'ID: " + id));
    }

    // Mettre à jour une question
    public Question updateQuestion(Long id, Question questionDetails) {
        Question question = getQuestionById(id);

        if (questionDetails.getContent() != null) {
            question.setContent(questionDetails.getContent());
        }
        if (questionDetails.getScore() != null) {
            question.setScore(questionDetails.getScore());
        }
        if (questionDetails.getType() != null) {
            question.setType(questionDetails.getType());
        }
        if (questionDetails.getExam() != null) {
            question.setExam(questionDetails.getExam());
        }

        return questionRepository.save(question);
    }

    // Supprimer une question
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new RuntimeException("Question non trouvée avec l'ID: " + id);
        }
        questionRepository.deleteById(id);
    }

    // Récupérer les questions par examen
    public List<Question> getQuestionsByExam(Exam exam) {
        return questionRepository.findByExam(exam);
    }

    // Récupérer les questions par ID d'examen
    public List<Question> getQuestionsByExamId(Long examId) {
        return questionRepository.findByExamId(examId);
    }
}

