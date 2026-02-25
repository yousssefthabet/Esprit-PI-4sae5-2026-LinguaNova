package com.LinguaNova.LinguaNova.repository;

import com.LinguaNova.LinguaNova.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    // méthodes spécifiques si besoin
}

