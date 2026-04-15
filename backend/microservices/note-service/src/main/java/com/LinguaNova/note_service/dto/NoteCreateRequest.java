package com.LinguaNova.note_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NoteCreateRequest {

    @Size(max = 150, message = "Le titre ne doit pas dépasser 150 caractères")
    private String title;

    @NotBlank(message = "Le contenu est obligatoire")
    @Size(max = 20000, message = "Le contenu ne doit pas dépasser 20000 caractères")
    private String content;

    @NotNull(message = "userId est obligatoire")
    private Long userId;

    @NotNull(message = "cahierId est obligatoire")
    private Long cahierId;
}

