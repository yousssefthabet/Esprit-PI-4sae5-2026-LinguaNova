package com.LinguaNova.LinguaNova.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import lombok.*;

@Entity
@Getter
@Setter
public class StudentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 2000, message = "La réponse textuelle ne peut pas dépasser 2000 caractères")
    private String textAnswer;

    @Size(max = 2000, message = "Le corrigé ne peut pas dépasser 2000 caractères")
    private String teacherComment;

    @JsonBackReference("studentExam-answers")
    @ManyToOne
    private StudentExam studentExam;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Question question;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Reponse selectedReponse; // pour QCM

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTextAnswer() {
        return textAnswer;
    }

    public void setTextAnswer(String textAnswer) {
        this.textAnswer = textAnswer;
    }

    public String getTeacherComment() {
        return teacherComment;
    }

    public void setTeacherComment(String teacherComment) {
        this.teacherComment = teacherComment;
    }

    public StudentExam getStudentExam() {
        return studentExam;
    }

    public void setStudentExam(StudentExam studentExam) {
        this.studentExam = studentExam;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Reponse getSelectedReponse() {
        return selectedReponse;
    }

    public void setSelectedReponse(Reponse selectedReponse) {
        this.selectedReponse = selectedReponse;
    }
}
