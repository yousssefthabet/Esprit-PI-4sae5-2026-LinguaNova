package com.LinguaNova.note_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NoteImportArticleRequest {

    @Size(max = 500, message = "Le titre ne doit pas depasser 500 caracteres")
    private String title;

    @NotBlank(message = "Le contenu est obligatoire")
    @Size(max = 20000, message = "Le contenu ne doit pas depasser 20000 caracteres")
    private String content;

    @NotBlank(message = "sourceUrl est obligatoire")
    @Size(max = 1000, message = "sourceUrl ne doit pas depasser 1000 caracteres")
    private String sourceUrl;

    @Size(max = 255, message = "sourceDomain ne doit pas depasser 255 caracteres")
    private String sourceDomain;

    @Size(max = 500, message = "sourceTitle ne doit pas depasser 500 caracteres")
    private String sourceTitle;

    private String publishedAt;

    private String fetchedAt;
}
