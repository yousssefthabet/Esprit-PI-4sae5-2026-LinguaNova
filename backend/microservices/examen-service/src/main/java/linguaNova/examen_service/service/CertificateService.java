package linguaNova.examen_service.service;

import linguaNova.examen_service.client.UserClient;
import linguaNova.examen_service.dto.UserResponse;
import linguaNova.examen_service.entity.Certificate;
import linguaNova.examen_service.entity.Exam;
import linguaNova.examen_service.entity.StudentExam;
import linguaNova.examen_service.repository.CertificateRepository;
import linguaNova.examen_service.repository.StudentExamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentExamRepository studentExamRepository;
    private final UserClient userClient;
    private final CertificatePdfService certificatePdfService;

    public CertificateService(CertificateRepository certificateRepository,
                              StudentExamRepository studentExamRepository,
                              UserClient userClient,
                              CertificatePdfService certificatePdfService) {
        this.certificateRepository = certificateRepository;
        this.studentExamRepository = studentExamRepository;
        this.userClient = userClient;
        this.certificatePdfService = certificatePdfService;
    }

    public List<Certificate> getCertificatesByUserId(Long userId) {
        return certificateRepository.findByUserIdOrderByIssuedAtDesc(userId);
    }

    public Certificate getCertificate(Long id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificat introuvable: " + id));
    }

    public Certificate getCertificateByStudentExamId(Long studentExamId) {
        return certificateRepository.findByStudentExamId(studentExamId)
                .orElseThrow(() -> new RuntimeException("Aucun certificat pour studentExamId=" + studentExamId));
    }

    @Transactional
    public Certificate generateIfEligible(Long studentExamId) {
        // Idempotent
        return certificateRepository.findByStudentExamId(studentExamId)
                .orElseGet(() -> generateNew(studentExamId));
    }

    private Certificate generateNew(Long studentExamId) {
        StudentExam studentExam = studentExamRepository.findById(studentExamId)
                .orElseThrow(() -> new RuntimeException("Examen étudiant non trouvé avec l'ID: " + studentExamId));
        Exam exam = studentExam.getExam();
        if (exam == null) {
            throw new RuntimeException("StudentExam sans exam");
        }
        if (exam.getMaxScore() == null || exam.getMaxScore() <= 0) {
            throw new RuntimeException("maxScore invalide pour l'examen, impossible de calculer le %");
        }

        double score = studentExam.getScore() != null ? studentExam.getScore() : 0d;
        double pct = (score / exam.getMaxScore()) * 100d;
        if (pct < 70d) {
            throw new RuntimeException("Non éligible au certificat: " + String.format("%.1f%%", pct));
        }

        Long userId = studentExam.getUserId();
        if (userId == null) {
            throw new RuntimeException("StudentExam sans userId");
        }

        UserResponse user = null;
        try { user = userClient.getUserById(userId); } catch (Exception ignored) {}

        String code = UUID.randomUUID().toString().replace("-", "").substring(0, 20).toUpperCase();
        byte[] pdf = certificatePdfService.generateCertificatePdf(studentExam, exam, user);

        Certificate cert = Certificate.builder()
                .certificateCode(code)
                .issuedAt(LocalDateTime.now())
                .userId(userId)
                .exam(exam)
                .studentExam(studentExam)
                .pdfData(pdf)
                .pdfFileName("certificate-" + code + ".pdf")
                .contentType("application/pdf")
                .build();

        return certificateRepository.save(cert);
    }
}

