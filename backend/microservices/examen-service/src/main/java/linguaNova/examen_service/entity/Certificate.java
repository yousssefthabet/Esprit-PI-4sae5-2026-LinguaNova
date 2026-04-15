package linguaNova.examen_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Code public unique affiché sur le certificat.
     */
    @Column(nullable = false, unique = true, length = 64)
    private String certificateCode;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

    /**
     * Pour faciliter l'accès depuis le profil étudiant.
     */
    @Column(nullable = false)
    private Long userId;

    @ManyToOne(optional = false)
    private Exam exam;

    @OneToOne(optional = false)
    private StudentExam studentExam;

    /**
     * PDF stocké en base (simple). Pour gros volumes, préférer un stockage objet (S3/MinIO).
     */
    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    private byte[] pdfData;

    private String pdfFileName;

    private String contentType;
}

