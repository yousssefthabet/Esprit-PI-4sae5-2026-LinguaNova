package com.LinguaNova.note_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class NoteImportBatchRequest {

    @NotNull(message = "userId est obligatoire")
    private Long userId;

    @NotNull(message = "cahierId est obligatoire")
    private Long cahierId;

    @NotBlank(message = "importQuery est obligatoire")
    private String importQuery;

    @NotEmpty(message = "articles est obligatoire")
    @Valid
    private List<NoteImportArticleRequest> articles;
}
