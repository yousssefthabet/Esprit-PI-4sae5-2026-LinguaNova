package com.LinguaNova.note_service.dto;

import com.LinguaNova.note_service.entity.NoteContextType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CahierCreateRequest {

    @NotBlank(message = "Le nom du contexte est obligatoire")
    private String nomContexte;

    @NotNull(message = "Le type de contexte est obligatoire")
    private NoteContextType contextType;

    @NotNull(message = "userId est obligatoire")
    private Long userId;
}

