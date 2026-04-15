package com.LinguaNova.note_service.dto;

import com.LinguaNova.note_service.entity.NoteContextType;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CahierResponse {
    Long idCahier;
    String nomContexte;
    NoteContextType contextType;
    Long userId;
}
