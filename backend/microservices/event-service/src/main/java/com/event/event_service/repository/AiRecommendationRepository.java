package com.event.event_service.repository;

import com.event.event_service.entity.AiRecommendation;
import com.event.event_service.entity.RecommendationStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiRecommendationRepository extends JpaRepository<AiRecommendation, Long> {
    List<AiRecommendation> findTop20ByClubIdOrderByCreatedAtDesc(String clubId);
    List<AiRecommendation> findByClubIdAndStatusInOrderByCreatedAtDesc(String clubId, List<RecommendationStatus> statuses);
    Optional<AiRecommendation> findTop1ByClubIdAndTitleAndStatusInAndCreatedAtAfter(
            String clubId,
            String title,
            List<RecommendationStatus> statuses,
            LocalDateTime createdAt
    );
}

