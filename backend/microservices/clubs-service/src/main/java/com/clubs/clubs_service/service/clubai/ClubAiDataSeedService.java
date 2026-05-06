package com.clubs.clubs_service.service.clubai;

import com.clubs.clubs_service.entity.ActivityDifficulty;
import com.clubs.clubs_service.entity.Club;
import com.clubs.clubs_service.entity.ClubActivity;
import com.clubs.clubs_service.entity.ClubActivityType;
import com.clubs.clubs_service.entity.ClubMember;
import com.clubs.clubs_service.entity.ClubSession;
import com.clubs.clubs_service.repository.ClubActivityRepository;
import com.clubs.clubs_service.repository.ClubMemberRepository;
import com.clubs.clubs_service.repository.ClubRepository;
import com.clubs.clubs_service.repository.ClubSessionRepository;
import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClubAiDataSeedService {

    private final ClubRepository clubRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final ClubSessionRepository clubSessionRepository;
    private final ClubActivityRepository clubActivityRepository;

    @PostConstruct
    @Transactional
    public void seedIfNeeded() {
        List<Club> clubs = clubRepository.findAllByOrderByIdAsc();
        for (Club club : clubs) {
            seedMembers(club);
            seedSessions(club);
            seedActivities(club);
        }
    }

    private void seedMembers(Club club) {
        if (clubMemberRepository.countByClubId(club.getId()) > 0) {
            return;
        }
        int requested = Math.max(30, Math.min(200, Math.max(30, safeMemberCount(club) / 8)));
        int baseHash = Math.abs(club.getId().hashCode());
        Random random = new Random(baseHash);

        List<ClubMember> members = new ArrayList<>();
        for (int i = 0; i < requested; i++) {
            long studentId = Math.abs((long) baseHash * 10_000L) + i + 1;
            boolean active = random.nextDouble() > 0.28;
            int levelAtJoin = 1 + random.nextInt(3);
            int progression = random.nextInt(4);
            int currentLevel = Math.min(6, levelAtJoin + progression);
            LocalDateTime joinedAt = LocalDateTime.now().minusDays(20 + random.nextInt(220));
            LocalDateTime lastActiveAt = active
                    ? LocalDateTime.now().minusDays(random.nextInt(7))
                    : LocalDateTime.now().minusDays(15 + random.nextInt(60));

            members.add(ClubMember.builder()
                    .clubId(club.getId())
                    .studentId(studentId)
                    .joinedAt(joinedAt)
                    .lastActiveAt(lastActiveAt)
                    .active(active)
                    .levelAtJoin(levelAtJoin)
                    .currentLevel(currentLevel)
                    .speakingContributions(random.nextInt(active ? 10 : 3))
                    .build());
        }
        clubMemberRepository.saveAll(members);
    }

    private void seedSessions(Club club) {
        if (clubSessionRepository.countByClubId(club.getId()) > 0) {
            return;
        }
        int totalMembers = Math.max(20, (int) clubMemberRepository.countByClubId(club.getId()));
        int activeMembers = Math.max(1, (int) clubMemberRepository.countByClubIdAndActiveTrue(club.getId()));
        Random random = new Random(Math.abs(club.getSlug().hashCode()));

        List<ClubSession> sessions = new ArrayList<>();
        for (int i = 10; i >= 0; i--) {
            int attendees = Math.min(totalMembers, Math.max(4, (int) Math.round(activeMembers * (0.45 + random.nextDouble() * 0.4))));
            int speaking = Math.max(2, (int) Math.round(attendees * (0.25 + random.nextDouble() * 0.4)));

            sessions.add(ClubSession.builder()
                    .clubId(club.getId())
                    .title(sessionTitle(club, i))
                    .sessionDate(LocalDate.now().minusWeeks(i))
                    .attendeeCount(attendees)
                    .speakingParticipantsCount(Math.min(attendees, speaking))
                    .durationMinutes(45 + random.nextInt(40))
                    .build());
        }
        clubSessionRepository.saveAll(sessions);
    }

    private void seedActivities(Club club) {
        if (clubActivityRepository.countByClubId(club.getId()) > 0) {
            return;
        }
        int assignedMembers = Math.max(20, (int) clubMemberRepository.countByClubId(club.getId()));
        Random random = new Random(Math.abs((club.getId() + "-activity").hashCode()));
        ClubActivityType[] types = ClubActivityType.values();
        ActivityDifficulty[] difficulties = ActivityDifficulty.values();

        List<ClubActivity> activities = new ArrayList<>();
        for (int i = 0; i < 8; i++) {
            int assigned = Math.min(assignedMembers, Math.max(10, assignedMembers - random.nextInt(8)));
            int completed = Math.min(assigned, Math.max(0, (int) Math.round(assigned * (0.38 + random.nextDouble() * 0.5))));

            activities.add(ClubActivity.builder()
                    .clubId(club.getId())
                    .title(activityTitle(club, i))
                    .description("AI-seeded collaborative activity for " + club.getTitle()
                            + ". Focus on participation, vocabulary, and practical communication.")
                    .activityType(types[i % types.length])
                    .difficulty(difficulties[i % difficulties.length])
                    .assignedMembers(assigned)
                    .completedMembers(completed)
                    .generatedByAi(i % 2 == 0)
                    .published(true)
                    .createdAt(LocalDateTime.now().minusDays(3L * i))
                    .build());
        }
        clubActivityRepository.saveAll(activities);
    }

    private String sessionTitle(Club club, int weeksAgo) {
        if (weeksAgo <= 1) {
            return club.getTitle() + " Live Session";
        }
        return club.getTitle() + " Weekly Session -" + " Week " + (weeksAgo + 1);
    }

    private String activityTitle(Club club, int index) {
        return switch (index % 4) {
            case 0 -> "Vocabulary Booster Challenge";
            case 1 -> "Speaking Pair Practice";
            case 2 -> "Role-play Scenario Sprint";
            default -> "Discussion Topic Studio";
        } + " - " + club.getCategory().toUpperCase(Locale.ROOT);
    }

    private int safeMemberCount(Club club) {
        return club.getMemberCount() == null ? 0 : Math.max(0, club.getMemberCount());
    }
}

