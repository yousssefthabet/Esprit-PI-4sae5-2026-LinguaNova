package com.event.event_service.repository;

import com.event.event_service.entity.ClubMember;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
    List<ClubMember> findByClubId(String clubId);
    List<ClubMember> findTop100ByClubIdOrderByLastActiveAtDesc(String clubId);
    Optional<ClubMember> findByClubIdAndStudentId(String clubId, Long studentId);

    long countByClubId(String clubId);
    long countByClubIdAndActiveTrue(String clubId);
    long countByClubIdAndActiveFalse(String clubId);
    long countByClubIdAndLastActiveAtBefore(String clubId, LocalDateTime threshold);
}

