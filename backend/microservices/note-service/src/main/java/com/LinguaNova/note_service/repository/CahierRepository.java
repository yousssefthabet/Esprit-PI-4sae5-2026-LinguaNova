package com.LinguaNova.note_service.repository;

import com.LinguaNova.note_service.entity.Cahier;
import com.LinguaNova.note_service.entity.NoteContextType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CahierRepository extends JpaRepository<Cahier, Long> {

    List<Cahier> findByUserId(Long userId);

    List<Cahier> findByUserIdAndContextType(Long userId, NoteContextType contextType);
}

