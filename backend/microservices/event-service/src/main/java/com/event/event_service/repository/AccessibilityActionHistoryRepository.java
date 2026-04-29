package com.event.event_service.repository;

import com.event.event_service.entity.AccessibilityActionHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessibilityActionHistoryRepository extends JpaRepository<AccessibilityActionHistory, Long> {
    List<AccessibilityActionHistory> findTop50ByUserIdOrderByCreatedAtDesc(String userId);
}

