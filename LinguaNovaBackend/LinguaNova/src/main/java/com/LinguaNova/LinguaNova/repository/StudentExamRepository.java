package com.LinguaNova.LinguaNova.repository;

import com.LinguaNova.LinguaNova.entity.StudentExam;
import com.LinguaNova.LinguaNova.entity.StudentProfile;
import com.LinguaNova.LinguaNova.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentExamRepository extends JpaRepository<StudentExam, Long> {
    List<StudentExam> findByStudentProfile(StudentProfile studentProfile);
    List<StudentExam> findByExam(Exam exam);
    List<StudentExam> findByStudentProfileId(Long studentProfileId);
    List<StudentExam> findByExamId(Long examId);
}