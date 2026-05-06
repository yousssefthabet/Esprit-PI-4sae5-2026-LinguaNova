package com.clubs.clubs_service.repository;

import com.clubs.clubs_service.entity.Club;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, String> {
    List<Club> findAllByOrderByIdAsc();
    Optional<Club> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, String id);
}
