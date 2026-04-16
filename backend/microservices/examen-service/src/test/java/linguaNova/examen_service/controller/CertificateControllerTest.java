package linguaNova.examen_service.controller;

import linguaNova.examen_service.entity.Certificate;
import linguaNova.examen_service.service.CertificateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CertificateController.class)
class CertificateControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    CertificateService certificateService;

    @Test
    void generate_returns200() throws Exception {
        Certificate cert = Certificate.builder()
                .id(1L)
                .certificateCode("ABC")
                .issuedAt(LocalDateTime.now())
                .userId(2L)
                .pdfFileName("cert.pdf")
                .contentType("application/pdf")
                .pdfData("pdf".getBytes(StandardCharsets.UTF_8))
                .build();

        when(certificateService.generateIfEligible(10L)).thenReturn(cert);

        mockMvc.perform(post("/api/certificates/generate/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(certificateService).generateIfEligible(10L);
    }

    @Test
    void byUser_returns200() throws Exception {
        when(certificateService.getCertificatesByUserId(5L)).thenReturn(List.of());

        mockMvc.perform(get("/api/certificates/by-user/5"))
                .andExpect(status().isOk());

        verify(certificateService).getCertificatesByUserId(5L);
    }

    @Test
    void downloadPdf_whenPdfNull_returns404() throws Exception {
        Certificate cert = Certificate.builder().id(1L).pdfData(null).build();
        when(certificateService.getCertificate(1L)).thenReturn(cert);

        mockMvc.perform(get("/api/certificates/1/pdf"))
                .andExpect(status().isNotFound());

        verify(certificateService).getCertificate(1L);
    }

    @Test
    void downloadPdf_whenPdfExists_returnsPdf() throws Exception {
        byte[] pdf = "pdf".getBytes(StandardCharsets.UTF_8);
        Certificate cert = Certificate.builder().id(1L).pdfData(pdf).pdfFileName("cert.pdf").build();
        when(certificateService.getCertificate(1L)).thenReturn(cert);

        mockMvc.perform(get("/api/certificates/1/pdf"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "inline; filename=\"cert.pdf\""))
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));

        verify(certificateService).getCertificate(1L);
    }

    @Test
    void verify_returns200() throws Exception {
        mockMvc.perform(get("/api/certificates/verify/XYZ"))
                .andExpect(status().isOk());

        verifyNoInteractions(certificateService);
    }
}
