package linguaNova.examen_service.service;

import linguaNova.examen_service.entity.Question;
import linguaNova.examen_service.entity.Reponse;
import linguaNova.examen_service.repository.ReponseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ReponseService {

    private final ReponseRepository reponseRepository;

    public ReponseService(ReponseRepository reponseRepository) {
        this.reponseRepository = reponseRepository;
    }

    // Créer une réponse
    public Reponse createReponse(Reponse reponse) {
        return reponseRepository.save(reponse);
    }

    // Récupérer toutes les réponses
    public List<Reponse> getAllReponses() {
        return reponseRepository.findAll();
    }

    // Récupérer une réponse par ID
    public Reponse getReponseById(Long id) {
        return reponseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réponse non trouvée avec l'ID: " + id));
    }

    // Mettre à jour une réponse
    public Reponse updateReponse(Long id, Reponse reponseDetails) {
        Reponse reponse = getReponseById(id);

        if (reponseDetails.getContent() != null) {
            reponse.setContent(reponseDetails.getContent());
        }
        if (reponseDetails.getCorrect() != null) {
            reponse.setCorrect(reponseDetails.getCorrect());
        }
        if (reponseDetails.getQuestion() != null) {
            reponse.setQuestion(reponseDetails.getQuestion());
        }

        return reponseRepository.save(reponse);
    }

    // Supprimer une réponse
    public void deleteReponse(Long id) {
        if (!reponseRepository.existsById(id)) {
            throw new RuntimeException("Réponse non trouvée avec l'ID: " + id);
        }
        reponseRepository.deleteById(id);
    }

    // Récupérer les réponses par question
    public List<Reponse> getReponsesByQuestion(Question question) {
        return reponseRepository.findByQuestion(question);
    }

    // Récupérer les réponses par ID de question
    public List<Reponse> getReponsesByQuestionId(Long questionId) {
        return reponseRepository.findByQuestionId(questionId);
    }

    // Récupérer les réponses correctes par question
    public List<Reponse> getCorrectReponsesByQuestionId(Long questionId) {
        return reponseRepository.findByQuestionIdAndCorrectTrue(questionId);
    }
}

