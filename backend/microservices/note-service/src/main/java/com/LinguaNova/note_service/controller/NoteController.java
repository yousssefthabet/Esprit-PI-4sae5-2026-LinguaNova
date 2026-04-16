package com.LinguaNova.note_service.controller;

import com.LinguaNova.note_service.dto.NoteCreateRequest;
import com.LinguaNova.note_service.dto.NoteImportBatchRequest;
import com.LinguaNova.note_service.dto.NoteImportBatchResponse;
import com.LinguaNova.note_service.dto.NoteResponse;
import com.LinguaNova.note_service.dto.NoteUpdateRequest;
import com.LinguaNova.note_service.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@Tag(name = "Notes", description = "API de gestion des notes")
public class NoteController {

  private final NoteService noteService;

  public NoteController(NoteService noteService) {
    this.noteService = noteService;
  }

  @PostMapping
  @Operation(summary = "Créer une note")
  public ResponseEntity<NoteResponse> create(@Valid @RequestBody NoteCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(noteService.create(request));
  }

  @GetMapping("/web-search")
  @Operation(summary = "Recherche d'articles via DuckDuckGo — retourne des URLs réelles")
  public ResponseEntity<java.util.List<java.util.Map<String, String>>> webSearch(@RequestParam String q) {
    try {
      String encoded = java.net.URLEncoder.encode(q, java.nio.charset.StandardCharsets.UTF_8);
      org.jsoup.nodes.Document doc = org.jsoup.Jsoup
        .connect("https://html.duckduckgo.com/html/?q=" + encoded)
        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        .header("Accept-Language", "en-US,en;q=0.9")
        .timeout(10000)
        .get();

      java.util.List<java.util.Map<String, String>> results = new java.util.ArrayList<>();

      for (org.jsoup.nodes.Element el : doc.select("div.result")) {
        org.jsoup.nodes.Element anchor = el.selectFirst("a.result__a");
        org.jsoup.nodes.Element snippetEl = el.selectFirst("a.result__snippet");
        if (anchor == null) continue;

        // DuckDuckGo wraps hrefs like: //duckduckgo.com/l/?uddg=REAL_URL&...
        String href = anchor.attr("href");
        String url = href;
        if (href.contains("uddg=")) {
          String uddg = href.substring(href.indexOf("uddg=") + 5);
          if (uddg.contains("&")) uddg = uddg.substring(0, uddg.indexOf("&"));
          url = java.net.URLDecoder.decode(uddg, java.nio.charset.StandardCharsets.UTF_8);
        }
        if (!url.startsWith("http")) continue;

        String host;
        try { host = new java.net.URL(url).getHost().replace("www.", ""); }
        catch (Exception ex) { host = url; }

        java.util.Map<String, String> item = new java.util.LinkedHashMap<>();
        item.put("title", anchor.text());
        item.put("url", url);
        item.put("snippet", snippetEl != null ? snippetEl.text() : "");
        item.put("sourceDomain", host);
        results.add(item);

        if (results.size() >= 15) break;
      }
      return ResponseEntity.ok(results);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(java.util.List.of());
    }
  }

  @GetMapping("/{id}")
  @Operation(summary = "Récupérer une note par ID")
  public ResponseEntity<NoteResponse> getById(@PathVariable Long id) {
    try {
      return ResponseEntity.ok(noteService.getById(id));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
  }

  @GetMapping
  @Operation(summary = "Lister les notes (filtrables par cahier)")
  public ResponseEntity<List<NoteResponse>> list(
    @RequestParam Long userId,
    @RequestParam(required = false) Long cahierId
  ) {
    return ResponseEntity.ok(noteService.list(userId, cahierId));
  }

  @PutMapping("/{id}")
  @Operation(summary = "Modifier une note")
  public ResponseEntity<NoteResponse> update(@PathVariable Long id, @Valid @RequestBody NoteUpdateRequest request) {
    try {
      return ResponseEntity.ok(noteService.update(id, request));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Supprimer une note")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    try {
      noteService.delete(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  @PostMapping("/import-batch")
  @Operation(summary = "Importer un lot d'articles en notes")
  public ResponseEntity<NoteImportBatchResponse> importBatch(@Valid @RequestBody NoteImportBatchRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(noteService.importBatch(request));
  }
}

