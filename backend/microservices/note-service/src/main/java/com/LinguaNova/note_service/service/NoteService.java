package com.LinguaNova.note_service.service;

import com.LinguaNova.note_service.dto.*;
import com.LinguaNova.note_service.entity.Cahier;
import com.LinguaNova.note_service.entity.Note;
import com.LinguaNova.note_service.entity.NoteContextType;
import com.LinguaNova.note_service.entity.NoteSource;
import com.LinguaNova.note_service.repository.CahierRepository;
import com.LinguaNova.note_service.repository.NoteRepository;
import com.LinguaNova.note_service.repository.NoteSourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class NoteService {

  private final NoteRepository noteRepository;
  private final CahierRepository cahierRepository;
  private final NoteSourceRepository noteSourceRepository;

  @org.springframework.beans.factory.annotation.Value("${gemini.api.key:}")
  private String geminiApiKey;

  public NoteService(
    NoteRepository noteRepository,
    CahierRepository cahierRepository,
    NoteSourceRepository noteSourceRepository
  ) {
    this.noteRepository = noteRepository;
    this.cahierRepository = cahierRepository;
    this.noteSourceRepository = noteSourceRepository;
  }

  public NoteResponse create(NoteCreateRequest req) {
    Cahier cahier = cahierRepository.findById(req.getCahierId())
      .orElseThrow(() -> new RuntimeException("Cahier non trouve avec l'ID: " + req.getCahierId()));

    Note note = Note.builder()
      .title(req.getTitle())
      .content(req.getContent())
      .cahier(cahier)
      .userId(req.getUserId())
      .build();

    return toResponse(noteRepository.save(note));
  }

  public NoteResponse getById(Long id) {
    return toResponse(getEntity(id));
  }

  public List<NoteResponse> list(Long userId, Long cahierId) {
    if (userId == null) {
      throw new RuntimeException("userId est obligatoire");
    }

    List<Note> notes;
    if (cahierId != null) {
      notes = noteRepository.findByUserIdAndCahierIdCahierOrderByUpdatedAtDesc(userId, cahierId);
    } else {
      notes = noteRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    return notes.stream().map(this::toResponse).toList();
  }

  public NoteResponse update(Long id, NoteUpdateRequest req) {
    Note note = getEntity(id);

    if (req.getTitle() != null) note.setTitle(req.getTitle());
    if (req.getContent() != null) note.setContent(req.getContent());
    if (req.getCahierId() != null) {
      Cahier cahier = cahierRepository.findById(req.getCahierId())
        .orElseThrow(() -> new RuntimeException("Cahier non trouve"));
      note.setCahier(cahier);
    }

    return toResponse(noteRepository.save(note));
  }

  public void delete(Long id) {
    if (!noteRepository.existsById(id)) {
      throw new RuntimeException("Note non trouvee avec l'ID: " + id);
    }
    noteRepository.deleteById(id);
  }

  @Transactional
  public NoteImportBatchResponse importBatch(NoteImportBatchRequest req) {
    Cahier cahier = cahierRepository.findById(req.getCahierId())
      .orElseThrow(() -> new RuntimeException("Cahier non trouve avec l'ID: " + req.getCahierId()));

    if (!req.getUserId().equals(cahier.getUserId())) {
      throw new RuntimeException("Ce cahier n'appartient pas a l'utilisateur " + req.getUserId());
    }

    List<NoteImportItemResult> results = new ArrayList<>();

    for (NoteImportArticleRequest article : req.getArticles()) {
      try {
        String fullContent = scrapeAndCleanArticle(article.getSourceUrl(), article.getContent());
        String content = truncate(fullContent, 20000);
        if (isBlank(content)) {
          throw new RuntimeException("Le contenu est vide après scraping");
        }

        String title = firstNonBlank(
          truncate(article.getTitle(), 150),
          truncate(article.getSourceTitle(), 150),
          "Article importe"
        );

        Note savedNote = noteRepository.save(
          Note.builder()
            .title(title)
            .content(content)
            .cahier(cahier)
            .userId(req.getUserId())
            .build()
        );

        noteSourceRepository.save(
          NoteSource.builder()
            .note(savedNote)
            .sourceUrl(truncate(article.getSourceUrl(), 1000))
            .sourceDomain(firstNonBlank(truncate(article.getSourceDomain(), 255), extractDomain(article.getSourceUrl())))
            .sourceTitle(firstNonBlank(truncate(article.getSourceTitle(), 500), truncate(article.getTitle(), 500)))
            .publishedAt(parseDate(article.getPublishedAt()))
            .importQuery(truncate(req.getImportQuery(), 512))
            .fetchedAt(parseDateOrNow(article.getFetchedAt()))
            .build()
        );

        results.add(NoteImportItemResult.builder()
          .success(true)
          .noteId(savedNote.getId())
          .title(title)
          .sourceUrl(article.getSourceUrl())
          .reason("CREATED")
          .build());
      } catch (Exception e) {
        results.add(NoteImportItemResult.builder()
          .success(false)
          .noteId(null)
          .title(article.getTitle())
          .sourceUrl(article.getSourceUrl())
          .reason(e.getMessage() != null ? e.getMessage() : "UNKNOWN_ERROR")
          .build());
      }
    }

    int createdCount = (int) results.stream().filter(NoteImportItemResult::isSuccess).count();

    return NoteImportBatchResponse.builder()
      .userId(req.getUserId())
      .cahierId(req.getCahierId())
      .importQuery(req.getImportQuery())
      .requestedCount(req.getArticles().size())
      .createdCount(createdCount)
      .results(results)
      .build();
  }

  private Note getEntity(Long id) {
    return noteRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Note non trouvee avec l'ID: " + id));
  }

  private NoteResponse toResponse(Note note) {
    Long cahierId = note.getCahier() != null ? note.getCahier().getIdCahier() : null;
    String cahierNom = note.getCahier() != null ? note.getCahier().getNomContexte() : null;
    NoteContextType contextType = note.getCahier() != null ? note.getCahier().getContextType() : null;

    List<AttachmentResponse> attachments = note.getAttachments() != null ? note.getAttachments().stream()
      .map(att -> AttachmentResponse.builder()
        .id(att.getId())
        .fileName(att.getFileName())
        .contentType(att.getContentType())
        .size(att.getSize())
        .uploadedBy(att.getUploadedBy())
        .uploadedAt(att.getUploadedAt())
        .build())
      .toList() : List.of();

    return NoteResponse.builder()
      .id(note.getId())
      .title(note.getTitle())
      .content(note.getContent())
      .cahierId(cahierId)
      .cahierNom(cahierNom)
      .contextType(contextType)
      .userId(note.getUserId())
      .createdAt(note.getCreatedAt())
      .updatedAt(note.getUpdatedAt())
      .attachments(attachments)
      .build();
  }

  private static String extractDomain(String sourceUrl) {
    if (isBlank(sourceUrl)) return null;
    try {
      String host = URI.create(sourceUrl).getHost();
      if (host == null) return null;
      return host.startsWith("www.") ? host.substring(4) : host;
    } catch (Exception ignored) {
      return null;
    }
  }

  private static LocalDateTime parseDate(String value) {
    if (isBlank(value)) return null;
    try {
      return OffsetDateTime.parse(value).toLocalDateTime();
    } catch (DateTimeParseException ignored) {
    }
    try {
      return LocalDateTime.parse(value);
    } catch (DateTimeParseException ignored) {
      return null;
    }
  }

  private static LocalDateTime parseDateOrNow(String value) {
    LocalDateTime parsed = parseDate(value);
    return parsed != null ? parsed : LocalDateTime.now();
  }

  private static String truncate(String value, int maxLength) {
    if (value == null) return null;
    String trimmed = value.trim();
    return trimmed.length() <= maxLength ? trimmed : trimmed.substring(0, maxLength);
  }

  private static String firstNonBlank(String... values) {
    for (String value : values) {
      if (!isBlank(value)) return value;
    }
    return null;
  }

  private static boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }

  private String scrapeAndCleanArticle(String sourceUrl, String originalHtmlSnippet) {
    if (geminiApiKey == null || geminiApiKey.isEmpty() || "null".equals(geminiApiKey) || geminiApiKey.startsWith("$")) {
      return org.jsoup.Jsoup.parse(originalHtmlSnippet != null ? originalHtmlSnippet : "").text()
        + "\n\nSource: " + sourceUrl;
    }

    try {
      org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
      // Disable automatic exception throwing on non-2xx so we can return scraped fallback
      restTemplate.setErrorHandler(new org.springframework.web.client.DefaultResponseErrorHandler() {
        @Override public boolean hasError(org.springframework.http.client.ClientHttpResponse r) { return false; }
      });

      String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

      String prompt = "Fetch the article at this URL and summarize it in clean, structured notes (bullet points, key facts, main takeaways). " +
        "Ignore navigation, ads, and menus. Write in the same language as the article.\n\nURL: " + sourceUrl;

      // Use url_context tool so Gemini fetches and reads the URL directly
      java.util.Map<String, Object> body = java.util.Map.of(
        "contents", java.util.List.of(
          java.util.Map.of("parts", java.util.List.of(java.util.Map.of("text", prompt)))
        ),
        "tools", java.util.List.of(java.util.Map.of("url_context", java.util.Map.of()))
      );

      org.springframework.http.ResponseEntity<java.util.Map> response =
        restTemplate.postForEntity(geminiUrl, body, java.util.Map.class);

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        java.util.List candidates = (java.util.List) response.getBody().get("candidates");
        if (candidates != null && !candidates.isEmpty()) {
          java.util.Map candidate = (java.util.Map) candidates.get(0);
          java.util.Map contentMap = (java.util.Map) candidate.get("content");
          if (contentMap != null) {
            java.util.List parts = (java.util.List) contentMap.get("parts");
            if (parts != null && !parts.isEmpty()) {
              java.util.Map part = (java.util.Map) parts.get(0);
              String text = (String) part.get("text");
              if (text != null && !text.isBlank()) {
                return text + "\n\nSource: " + sourceUrl;
              }
            }
          }
        }
      }

      // Gemini returned non-2xx or empty — fall back to RSS snippet
      String snippet = org.jsoup.Jsoup.parse(originalHtmlSnippet != null ? originalHtmlSnippet : "").text();
      return snippet + "\n\n(Résumé Gemini indisponible - " + response.getStatusCode() + ")\nSource: " + sourceUrl;

    } catch (Exception e) {
      String snippet = org.jsoup.Jsoup.parse(originalHtmlSnippet != null ? originalHtmlSnippet : "").text();
      return snippet + "\n\n(Résumé Gemini indisponible)\nSource: " + sourceUrl;
    }
  }
}
