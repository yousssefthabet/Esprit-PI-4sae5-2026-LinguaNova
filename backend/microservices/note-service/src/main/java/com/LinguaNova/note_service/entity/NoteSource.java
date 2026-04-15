package com.LinguaNova.note_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "note_source")
public class NoteSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;

    @Column(name = "source_url", nullable = false, length = 1000)
    private String sourceUrl;

    @Column(name = "source_domain", length = 255)
    private String sourceDomain;

    @Column(name = "source_title", length = 500)
    private String sourceTitle;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "import_query", nullable = false, length = 512)
    private String importQuery;

    @Column(name = "fetched_at", nullable = false)
    private LocalDateTime fetchedAt;
}
