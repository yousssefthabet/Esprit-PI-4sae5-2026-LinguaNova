package com.event.event_service.repository;

import com.event.event_service.entity.AiRecommendationActionHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiRecommendationActionHistoryRepository extends JpaRepository<AiRecommendationActionHistory, Long> {
    List<AiRecommendationActionHistory> findTop30ByClubIdOrderByActedAtDesc(String clubId);
}

