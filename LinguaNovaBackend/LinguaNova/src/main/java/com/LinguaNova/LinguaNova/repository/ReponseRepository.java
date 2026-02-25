package com.LinguaNova.LinguaNova.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.LinguaNova.LinguaNova.entity.Reponse;
import com.LinguaNova.LinguaNova.entity.Question;

import java.util.List;

@Repository
public interface ReponseRepository extends JpaRepository<Reponse, Long> {
    List<Reponse> findByQuestion(Question question);
    List<Reponse> findByQuestionId(Long questionId);
    List<Reponse> findByQuestionIdAndCorrectTrue(Long questionId);
}
