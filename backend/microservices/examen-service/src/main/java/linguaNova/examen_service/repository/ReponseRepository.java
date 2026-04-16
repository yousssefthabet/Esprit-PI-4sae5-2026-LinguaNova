package linguaNova.examen_service.repository;

import linguaNova.examen_service.entity.Question;
import linguaNova.examen_service.entity.Reponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReponseRepository extends JpaRepository<Reponse, Long> {
    List<Reponse> findByQuestion(Question question);
    List<Reponse> findByQuestionId(Long questionId);
    List<Reponse> findByQuestionIdAndCorrectTrue(Long questionId);
}
