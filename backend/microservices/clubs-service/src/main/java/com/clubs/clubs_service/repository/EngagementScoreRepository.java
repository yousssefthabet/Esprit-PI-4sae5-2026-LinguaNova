package com.clubs.clubs_service.repository;

import com.clubs.clubs_service.entity.EngagementScore;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EngagementScoreRepository extends JpaRepository<EngagementScore, Long> {
    Optional<EngagementScore> findTop1ByClubIdOrderByCalculatedAtDesc(String clubId);
    List<EngagementScore> findTop24ByClubIdOrderByCalculatedAtDesc(String clubId);
}

