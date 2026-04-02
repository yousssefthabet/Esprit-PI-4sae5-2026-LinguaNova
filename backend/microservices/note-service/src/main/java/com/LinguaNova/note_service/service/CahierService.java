package com.LinguaNova.note_service.service;

import com.LinguaNova.note_service.dto.CahierCreateRequest;
import com.LinguaNova.note_service.dto.CahierResponse;
import com.LinguaNova.note_service.entity.Cahier;
import com.LinguaNova.note_service.entity.NoteContextType;
import com.LinguaNova.note_service.repository.CahierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CahierService {

    private final CahierRepository cahierRepository;

    public CahierService(CahierRepository cahierRepository) {
        this.cahierRepository = cahierRepository;
    }

    public CahierResponse create(CahierCreateRequest req) {
        Cahier cahier = Cahier.builder()
                .nomContexte(req.getNomContexte())
                .contextType(req.getContextType())
            .userId(req.getUserId())
                .build();

        return toResponse(cahierRepository.save(cahier));
    }

    public List<CahierResponse> list(Long userId, NoteContextType contextType) {
        if (userId == null) {
            return List.of();
        }

        List<Cahier> cahiers;
        if (contextType != null) {
            cahiers = cahierRepository.findByUserIdAndContextType(userId, contextType);
        } else {
            cahiers = cahierRepository.findByUserId(userId);
        }
        return cahiers.stream().map(this::toResponse).toList();
    }

    public void delete(Long id) {
        cahierRepository.deleteById(id);
    }

    public CahierResponse getById(Long id) {
        Cahier cahier = cahierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cahier non trouvé"));
        return toResponse(cahier);
    }

    public CahierResponse update(Long id, CahierCreateRequest req) {
        Cahier cahier = cahierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cahier non trouvé"));

        cahier.setNomContexte(req.getNomContexte());
        cahier.setContextType(req.getContextType());

        // userId n'est pas modifiable via update (choix métier). Si besoin, on peut l'ajouter.
        return toResponse(cahierRepository.save(cahier));
    }

    private CahierResponse toResponse(Cahier cahier) {
        return CahierResponse.builder()
                .idCahier(cahier.getIdCahier())
                .nomContexte(cahier.getNomContexte())
                .contextType(cahier.getContextType())
                .userId(cahier.getUserId())
                .build();
    }
}

