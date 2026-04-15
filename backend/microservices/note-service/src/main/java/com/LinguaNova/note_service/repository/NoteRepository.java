package com.LinguaNova.note_service.repository;

import com.LinguaNova.note_service.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUserIdOrderByUpdatedAtDesc(Long userId);

    List<Note> findByUserIdAndCahierIdCahierOrderByUpdatedAtDesc(Long userId, Long cahierId);
}

