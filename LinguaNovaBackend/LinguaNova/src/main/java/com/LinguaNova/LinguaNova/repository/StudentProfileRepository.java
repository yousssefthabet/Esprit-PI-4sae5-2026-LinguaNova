package com.LinguaNova.LinguaNova.repository;

import com.LinguaNova.LinguaNova.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    // méthodes spécifiques si besoin
}
