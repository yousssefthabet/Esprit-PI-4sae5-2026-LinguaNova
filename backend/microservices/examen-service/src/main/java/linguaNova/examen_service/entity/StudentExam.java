package linguaNova.examen_service.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Getter @Setter
public class StudentExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @PositiveOrZero(message = "Le score doit être positif ou zéro")
    private Double score;

    private LocalDateTime submittedAt;

    private Boolean validated;

    /**
     * Identifiant de l'etudiant dans user-service.
     * Relation logique inter-microservices (pas de FK SQL).
     */
    private Long userId;

    @JsonBackReference("exam-studentExams")
    @ManyToOne
    private Exam exam;

    @JsonManagedReference("studentExam-answers")
    @OneToMany(mappedBy = "studentExam", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentAnswer> answers;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Boolean getValidated() {
        return validated;
    }

    public void setValidated(Boolean validated) {
        this.validated = validated;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public List<StudentAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<StudentAnswer> answers) {
        this.answers = answers;
    }
}
