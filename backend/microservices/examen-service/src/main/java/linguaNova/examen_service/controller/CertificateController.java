package linguaNova.examen_service.controller;

import linguaNova.examen_service.entity.Certificate;
import linguaNova.examen_service.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@Tag(name = "Certificats", description = "Génération et téléchargement des certificats (PDF)")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @Operation(summary = "Générer un certificat si >=70% (idempotent)")
    @PostMapping("/generate/{studentExamId}")
    public ResponseEntity<Certificate> generate(@PathVariable Long studentExamId) {
        return ResponseEntity.ok(certificateService.generateIfEligible(studentExamId));
    }

    @Operation(summary = "Lister les certificats d'un user")
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<Certificate>> byUser(@PathVariable Long userId) {
        return ResponseEntity.ok(certificateService.getCertificatesByUserId(userId));
    }

    @Operation(summary = "Télécharger le PDF d'un certificat")
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        Certificate cert = certificateService.getCertificate(id);
        byte[] data = cert.getPdfData();
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + cert.getPdfFileName() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }

    @Operation(summary = "Récupérer le certificat d'un studentExam")
    @GetMapping("/by-student-exam/{studentExamId}")
    public ResponseEntity<Certificate> byStudentExam(@PathVariable Long studentExamId) {
        return ResponseEntity.ok(certificateService.getCertificateByStudentExamId(studentExamId));
    }

    @Operation(summary = "Vérifier un certificat par code (stub)")
    @GetMapping("/verify/{code}")
    public ResponseEntity<Void> verify(@PathVariable String code) {
        // Endpoint de vérification: à compléter si besoin (public page / check signature)
        return ResponseEntity.ok().build();
    }
}
