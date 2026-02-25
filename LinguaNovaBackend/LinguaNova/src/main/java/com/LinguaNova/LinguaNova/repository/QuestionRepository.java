package com.LinguaNova.LinguaNova.repository;
import com.LinguaNova.LinguaNova.entity.Question;
import com.LinguaNova.LinguaNova.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByExam(Exam exam);
    List<Question> findByExamId(Long examId);
}
