package com.LinguaNova.note_service.service;

import com.LinguaNova.note_service.dto.*;
import com.LinguaNova.note_service.entity.Cahier;
import com.LinguaNova.note_service.entity.Note;
import com.LinguaNova.note_service.entity.NoteContextType;
import com.LinguaNova.note_service.repository.CahierRepository;
import com.LinguaNova.note_service.repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final CahierRepository cahierRepository;

    public NoteService(NoteRepository noteRepository, CahierRepository cahierRepository) {
        this.noteRepository = noteRepository;
        this.cahierRepository = cahierRepository;
    }

    public NoteResponse create(NoteCreateRequest req) {
        Cahier cahier = cahierRepository.findById(req.getCahierId())
                .orElseThrow(() -> new RuntimeException("Cahier non trouvé avec l'ID: " + req.getCahierId()));

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
                    .orElseThrow(() -> new RuntimeException("Cahier non trouvé"));
            note.setCahier(cahier);
        }

        return toResponse(noteRepository.save(note));
    }

    public void delete(Long id) {
        if (!noteRepository.existsById(id)) {
            throw new RuntimeException("Note non trouvée avec l'ID: " + id);
        }
        noteRepository.deleteById(id);
    }

    private Note getEntity(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note non trouvée avec l'ID: " + id));
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
}

