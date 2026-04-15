package com.LinguaNova.note_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

/**
 * Référence légère vers l'utilisateur propriétaire.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserIdRef {

    @Column(name = "user_id", nullable = false)
    private Long id;
}
