package com.event.event_service.repository;

import com.event.event_service.entity.Club;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, String> {
    List<Club> findAllByOrderByIdAsc();
    Optional<Club> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, String id);
}
