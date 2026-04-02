package linguaNova.examen_service.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import linguaNova.examen_service.dto.UserResponse;
import linguaNova.examen_service.entity.Exam;
import linguaNova.examen_service.entity.StudentExam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class CertificatePdfService {

    @Value("${certificates.verificationBaseUrl:http://localhost:8086/api/certificates/verify}")
    private String verificationBaseUrl;

    public byte[] generateCertificatePdf(StudentExam studentExam, Exam exam, UserResponse user) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 50, 50, 50, 50);
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            document.open();

            // Frontend inspired Palette
            Color primaryText = new Color(31, 41, 55);       // gray-800
            Color accentTeal = new Color(45, 111, 107);      // #2D6F6B (LinguaNova green)
            Color subtleBg = new Color(240, 250, 249);       // #F0FAF9
            Color goldAccent = new Color(193, 155, 60);      // Premium gold

            // Add an external thick teal border
            PdfContentByte canvas = writer.getDirectContent();
            Rectangle border = new Rectangle(document.getPageSize());
            border.setLeft(20);
            border.setRight(document.getPageSize().getWidth() - 20);
            border.setTop(document.getPageSize().getHeight() - 20);
            border.setBottom(20);
            border.setBorder(Rectangle.BOX);
            border.setBorderWidth(6);
            border.setBorderColor(accentTeal);
            canvas.rectangle(border);

            // Add an inner thin gold border
            Rectangle innerBorder = new Rectangle(document.getPageSize());
            innerBorder.setLeft(30);
            innerBorder.setRight(document.getPageSize().getWidth() - 30);
            innerBorder.setTop(document.getPageSize().getHeight() - 30);
            innerBorder.setBottom(30);
            innerBorder.setBorder(Rectangle.BOX);
            innerBorder.setBorderWidth(1);
            innerBorder.setBorderColor(goldAccent);
            canvas.rectangle(innerBorder);

            Font mainTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 42, accentTeal);
            Font brandName = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, primaryText);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 14, new Color(107, 114, 128));
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36, goldAccent);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 16, primaryText);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, accentTeal);
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 12, primaryText);

            document.add(Chunk.NEWLINE);

            // Brand Header
            Paragraph brand = new Paragraph("LinguaNova", brandName);
            brand.setAlignment(Element.ALIGN_CENTER);
            document.add(brand);
            
            Paragraph subBrand = new Paragraph("EXCELLENCE EN APPRENTISSAGE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, goldAccent));
            subBrand.setAlignment(Element.ALIGN_CENTER);
            subBrand.setSpacingAfter(30);
            document.add(subBrand);

            // Huge Title
            Paragraph title = new Paragraph("CERTIFICAT DE RÉUSSITE", mainTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Awarded to
            Paragraph awardedTo = new Paragraph("Ce certificat est fièrement décerné à", subtitleFont);
            awardedTo.setAlignment(Element.ALIGN_CENTER);
            document.add(awardedTo);

            String fullName = safe(user != null ? user.getUsername() : null);
            if (fullName.isBlank()) {
                fullName = "Étudiant Exceptionnel";
            }

            Paragraph name = new Paragraph(fullName, nameFont);
            name.setAlignment(Element.ALIGN_CENTER);
            name.setSpacingBefore(10);
            name.setSpacingAfter(20);
            document.add(name);

            // Body
            Paragraph body = new Paragraph(
                    "Pour avoir complété avec succès le programme et excellé dans l'évaluation certifiante.",
                    bodyFont
            );
            body.setAlignment(Element.ALIGN_CENTER);
            body.setSpacingAfter(30);
            document.add(body);

            // Info Table
            PdfPTable info = new PdfPTable(2);
            info.setWidthPercentage(60);
            info.setHorizontalAlignment(Element.ALIGN_CENTER);
            info.setWidths(new float[]{1f, 2f});
            info.setSpacingAfter(40);

            addRow(info, "Cours / Module", exam.getCourseName(), labelFont, valueFont);
            addRow(info, "Titre de l'examen", exam.getTitle(), labelFont, valueFont);
            addRow(info, "Score Final", formatScore(studentExam, exam), labelFont, valueFont);
            addRow(info, "Date d'obtention", studentExam.getSubmittedAt() != null
                    ? studentExam.getSubmittedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                    : "-", labelFont, valueFont);
            document.add(info);

            // Footer (Signatures & QR)
            PdfPTable footer = new PdfPTable(3);
            footer.setWidthPercentage(90);
            footer.setWidths(new float[]{1f, 1f, 1f});

            // Left signature
            PdfPCell sig1Cell = new PdfPCell();
            sig1Cell.setBorder(Rectangle.NO_BORDER);
            sig1Cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph line1 = new Paragraph("_______________________", FontFactory.getFont(FontFactory.HELVETICA, 12, primaryText));
            line1.setAlignment(Element.ALIGN_CENTER);
            Paragraph text1 = new Paragraph("Direction Académique", subtitleFont);
            text1.setAlignment(Element.ALIGN_CENTER);
            sig1Cell.addElement(line1);
            sig1Cell.addElement(text1);
            footer.addCell(sig1Cell);

            // Middle QR code
            PdfPCell qrCell = new PdfPCell();
            qrCell.setBorder(Rectangle.NO_BORDER);
            qrCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            qrCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            
            String code = "CERT-" + studentExam.getId() + "-" + System.currentTimeMillis();
            String verifyUrl = verificationBaseUrl + "/" + code;
            Image qr = qrCodeImage(verifyUrl, 80, 80);
            if (qr != null) {
                qr.setAlignment(Element.ALIGN_CENTER);
                qrCell.addElement(qr);
            }
            Paragraph codeP = new Paragraph("Réf: " + code, FontFactory.getFont(FontFactory.HELVETICA, 8, new Color(156, 163, 175)));
            codeP.setAlignment(Element.ALIGN_CENTER);
            qrCell.addElement(codeP);
            footer.addCell(qrCell);

            // Right signature
            PdfPCell sig2Cell = new PdfPCell();
            sig2Cell.setBorder(Rectangle.NO_BORDER);
            sig2Cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph line2 = new Paragraph("_______________________", FontFactory.getFont(FontFactory.HELVETICA, 12, primaryText));
            line2.setAlignment(Element.ALIGN_CENTER);
            Paragraph text2 = new Paragraph("Instructeur du Cours", subtitleFont);
            text2.setAlignment(Element.ALIGN_CENTER);
            sig2Cell.addElement(line2);
            sig2Cell.addElement(text2);
            footer.addCell(sig2Cell);

            document.add(footer);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération pdf certificat", e);
        }
    }

    private static void addRow(PdfPTable t, String k, String v, Font kFont, Font vFont) {
        PdfPCell c1 = new PdfPCell(new Phrase(k, kFont));
        c1.setBorder(Rectangle.NO_BORDER);
        c1.setPadding(8);
        t.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(safe(v), vFont));
        c2.setBorder(Rectangle.NO_BORDER);
        c2.setPadding(8);
        t.addCell(c2);
    }

    private static String formatScore(StudentExam se, Exam exam) {
        double score = se.getScore() != null ? se.getScore() : 0d;
        double max = exam.getMaxScore() != null ? exam.getMaxScore() : 0d;
        if (max <= 0) return String.valueOf(score);
        double pct = (score / max) * 100d;
        return String.format("%.2f / %.2f (%.1f%%)", score, max, pct);
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }

    private static Image qrCodeImage(String text, int w, int h) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(text, BarcodeFormat.QR_CODE, w, h);
            BufferedImage img = MatrixToImageWriter.toBufferedImage(matrix);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            javax.imageio.ImageIO.write(img, "png", baos);
            Image itextImg = Image.getInstance(baos.toByteArray());
            itextImg.scaleToFit(w, h);
            return itextImg;
        } catch (WriterException | IOException | BadElementException e) {
            return null;
        }
    }
}

