package com.event.event_service.repository;

import com.event.event_service.entity.ClubActivity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubActivityRepository extends JpaRepository<ClubActivity, Long> {
    List<ClubActivity> findByClubIdOrderByCreatedAtDesc(String clubId);
    List<ClubActivity> findTop20ByClubIdOrderByCreatedAtDesc(String clubId);
    long countByClubId(String clubId);
}

