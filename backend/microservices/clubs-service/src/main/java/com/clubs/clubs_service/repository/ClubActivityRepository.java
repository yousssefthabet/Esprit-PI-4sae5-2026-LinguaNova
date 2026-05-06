package com.clubs.clubs_service.repository;

import com.clubs.clubs_service.entity.ClubActivity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubActivityRepository extends JpaRepository<ClubActivity, Long> {
    List<ClubActivity> findByClubIdOrderByCreatedAtDesc(String clubId);
    List<ClubActivity> findTop20ByClubIdOrderByCreatedAtDesc(String clubId);
    long countByClubId(String clubId);
}

