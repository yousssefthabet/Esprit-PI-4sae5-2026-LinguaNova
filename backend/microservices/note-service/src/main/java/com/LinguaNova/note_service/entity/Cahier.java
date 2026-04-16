package com.LinguaNova.note_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "cahier")
public class Cahier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCahier;

    @Column(nullable = false)
    private String nomContexte;

    @Enumerated(EnumType.STRING)
    @Column(name = "context_type", nullable = false, length = 16)
    private NoteContextType contextType;

    /**
     * On stocke l'ID de l'utilisateur (user-service) sans relation JPA inter-microservice.
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @OneToMany(mappedBy = "cahier", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnoreProperties({"cahier"})
    private List<Note> notes = new ArrayList<>();
}

