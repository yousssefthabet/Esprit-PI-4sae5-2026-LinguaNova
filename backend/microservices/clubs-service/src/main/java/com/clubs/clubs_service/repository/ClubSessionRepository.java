package com.clubs.clubs_service.repository;

import com.clubs.clubs_service.entity.ClubSession;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubSessionRepository extends JpaRepository<ClubSession, Long> {
    List<ClubSession> findTop12ByClubIdOrderBySessionDateDesc(String clubId);
    long countByClubId(String clubId);
}

