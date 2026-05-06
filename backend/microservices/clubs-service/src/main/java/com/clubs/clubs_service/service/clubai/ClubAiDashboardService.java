package com.clubs.clubs_service.service.clubai;

import com.clubs.clubs_service.dto.clubai.ClubActivityFeedItemDto;
import com.clubs.clubs_service.dto.clubai.ClubDashboardResponseDto;
import com.clubs.clubs_service.dto.clubai.ClubEngagementResponseDto;
import com.clubs.clubs_service.dto.clubai.ClubHealthMetricsDto;
import com.clubs.clubs_service.dto.clubai.ClubRecommendationDto;
import com.clubs.clubs_service.dto.clubai.ClubSessionAnalysisResponseDto;
import com.clubs.clubs_service.dto.clubai.GenerateClubActivityRequestDto;
import com.clubs.clubs_service.dto.clubai.GeneratedClubActivityResponseDto;
import com.clubs.clubs_service.dto.clubai.ParticipationTrendPointDto;
import com.clubs.clubs_service.dto.clubai.RecommendationActionHistoryDto;
import com.clubs.clubs_service.dto.clubai.RecommendationStatusUpdateRequestDto;
import com.clubs.clubs_service.dto.clubai.StudentClubInsightResponseDto;
import com.clubs.clubs_service.entity.AiRecommendation;
import com.clubs.clubs_service.entity.AiRecommendationActionHistory;
import com.clubs.clubs_service.entity.Club;
import com.clubs.clubs_service.entity.ClubActivity;
import com.clubs.clubs_service.entity.ClubMember;
import com.clubs.clubs_service.entity.ClubSession;
import com.clubs.clubs_service.entity.EngagementScore;
import com.clubs.clubs_service.entity.RecommendationStatus;
import com.clubs.clubs_service.repository.AiRecommendationActionHistoryRepository;
import com.clubs.clubs_service.repository.AiRecommendationRepository;
import com.clubs.clubs_service.repository.ClubActivityRepository;
import com.clubs.clubs_service.repository.ClubMemberRepository;
import com.clubs.clubs_service.repository.ClubRepository;
import com.clubs.clubs_service.repository.ClubSessionRepository;
import com.clubs.clubs_service.repository.EngagementScoreRepository;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ClubAiDashboardService {

    private static final DateTimeFormatter TREND_DATE = DateTimeFormatter.ofPattern("MMM d", Locale.ROOT);

    private final ClubRepository clubRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final ClubSessionRepository clubSessionRepository;
    private final ClubActivityRepository clubActivityRepository;
    private final EngagementScoreRepository engagementScoreRepository;
    private final AiRecommendationRepository aiRecommendationRepository;
    private final AiRecommendationActionHistoryRepository recommendationActionHistoryRepository;
    private final RuleBasedClubAiEngineService aiEngine;

    @Transactional(readOnly = true)
    public ClubEngagementResponseDto getEngagement(String clubIdOrSlug) {
        Club club = getClubOrThrow(clubIdOrSlug);
        Snapshot snapshot = buildSnapshot(club);
        ClubHealthMetricsDto metrics = buildMetrics(club, snapshot);
        List<ParticipationTrendPointDto> trends = buildParticipationTrends(snapshot.sessions(), metrics.totalMembers());
        String trendSummary = aiEngine.buildTrendSummary(trends);

        return new ClubEngagementResponseDto(
                club.getId(),
                club.getTitle(),
                metrics.activeMembers(),
                metrics.inactiveMembers(),
                metrics.engagementRate(),
                trends,
                trendSummary
        );
    }

    @Transactional
    public GeneratedClubActivityResponseDto generateActivity(String clubIdOrSlug, GenerateClubActivityRequestDto request) {
        Club club = getClubOrThrow(clubIdOrSlug);
        Snapshot snapshot = buildSnapshot(club);
        ClubHealthMetricsDto metrics = buildMetrics(club, snapshot);

        RuleBasedClubAiEngineService.ActivityBlueprint blueprint = aiEngine.generateActivityBlueprint(
                club.getTitle(),
                request == null ? null : request.preferredType(),
                request == null ? null : request.preferredDifficulty()
        );

        int assignedMembers = Math.max(10, metrics.totalMembers());
        ClubActivity activity = ClubActivity.builder()
                .clubId(club.getId())
                .title(blueprint.title())
                .description(blueprint.description())
                .activityType(blueprint.type())
                .difficulty(blueprint.difficulty())
                .assignedMembers(assignedMembers)
                .completedMembers(0)
                .generatedByAi(true)
                .published(false)
                .createdAt(LocalDateTime.now())
                .build();

        ClubActivity saved = clubActivityRepository.save(activity);
        return toGeneratedActivityDto(saved);
    }

    @Transactional
    public ClubSessionAnalysisResponseDto analyzeSessions(String clubIdOrSlug) {
        Club club = getClubOrThrow(clubIdOrSlug);
        return analyzeAndPersist(club);
    }

    @Transactional
    public List<ClubRecommendationDto> getRecommendations(String clubIdOrSlug) {
        Club club = getClubOrThrow(clubIdOrSlug);
        ClubSessionAnalysisResponseDto analysis = analyzeAndPersist(club);
        ensureRecommendations(club, analysis.detectedProblems(), analysis.metrics());
        return aiRecommendationRepository.findTop20ByClubIdOrderByCreatedAtDesc(club.getId())
                .stream()
                .map(this::toRecommendationDto)
                .toList();
    }

    @Transactional
    public ClubDashboardResponseDto getDashboard(String clubIdOrSlug) {
        Club club = getClubOrThrow(clubIdOrSlug);
        ClubSessionAnalysisResponseDto analysis = analyzeAndPersist(club);
        ensureRecommendations(club, analysis.detectedProblems(), analysis.metrics());
        List<ClubRecommendationDto> recommendations = aiRecommendationRepository.findTop20ByClubIdOrderByCreatedAtDesc(club.getId())
                .stream()
                .map(this::toRecommendationDto)
                .toList();
        List<RecommendationActionHistoryDto> actionHistory = recommendationActionHistoryRepository
                .findTop30ByClubIdOrderByActedAtDesc(club.getId())
                .stream()
                .map(this::toActionHistoryDto)
                .toList();
        List<ParticipationTrendPointDto> trends = buildParticipationTrends(
                clubSessionRepository.findTop12ByClubIdOrderBySessionDateDesc(club.getId()),
                analysis.metrics().totalMembers()
        );
        String trendSummary = aiEngine.buildTrendSummary(trends);

        return new ClubDashboardResponseDto(
                club.getId(),
                club.getTitle(),
                analysis.healthScore(),
                analysis.scoreInterpretation(),
                analysis.metrics(),
                analysis.detectedProblems(),
                recommendations,
                trends,
                trendSummary,
                analysis.summarySentence(),
                actionHistory
        );
    }

    @Transactional(readOnly = true)
    public List<ClubActivityFeedItemDto> getActivityFeed(String clubIdOrSlug) {
        Club club = getClubOrThrow(clubIdOrSlug);
        return clubActivityRepository.findTop20ByClubIdOrderByCreatedAtDesc(club.getId())
                .stream()
                .filter(ClubActivity::isPublished)
                .map(this::toFeedDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public StudentClubInsightResponseDto getStudentInsights(String clubIdOrSlug, Long studentId) {
        Club club = getClubOrThrow(clubIdOrSlug);
        Snapshot snapshot = buildSnapshot(club);
        ClubHealthMetricsDto metrics = buildMetrics(club, snapshot);

        Optional<ClubMember> existingMember = clubMemberRepository.findByClubIdAndStudentId(club.getId(), studentId);
        ClubMember member = existingMember.orElseGet(() -> syntheticMember(studentId));

        int pendingActivities = estimatePendingActivities(snapshot.activities(), metrics.activityCompletionRate(), member.isActive());
        double studentScore = computeStudentEngagementScore(member, metrics, pendingActivities);
        List<String> suggestions = aiEngine.buildStudentSuggestions(metrics, studentScore, pendingActivities);

        String suggestedNextAction = suggestions.isEmpty()
                ? "Keep participating in club activities."
                : suggestions.get(0);

        String nextRecommendedSession = snapshot.sessions().stream()
                .max(Comparator.comparing(ClubSession::getSessionDate))
                .map(session -> session.getTitle() + " (" + session.getSessionDate() + ")")
                .orElse("Join the next announced session.");

        return new StudentClubInsightResponseDto(
                club.getId(),
                studentId,
                aiEngine.engagementBand(studentScore),
                round(studentScore),
                suggestedNextAction,
                suggestions,
                pendingActivities,
                nextRecommendedSession
        );
    }

    @Transactional
    public ClubRecommendationDto updateRecommendationStatus(Long recommendationId, RecommendationStatusUpdateRequestDto request) {
        AiRecommendation recommendation = aiRecommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recommendation not found"));

        recommendation.setStatus(request.status());
        recommendation.setUpdatedAt(LocalDateTime.now());
        AiRecommendation saved = aiRecommendationRepository.save(recommendation);

        recommendationActionHistoryRepository.save(AiRecommendationActionHistory.builder()
                .recommendationId(saved.getId())
                .clubId(saved.getClubId())
                .status(saved.getStatus())
                .adminId(clean(request.adminId()))
                .note(clean(request.note()))
                .actedAt(LocalDateTime.now())
                .build());

        return toRecommendationDto(saved);
    }

    @Transactional
    public GeneratedClubActivityResponseDto publishActivity(Long activityId) {
        ClubActivity activity = clubActivityRepository.findById(activityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));
        activity.setPublished(true);
        ClubActivity saved = clubActivityRepository.save(activity);
        return toGeneratedActivityDto(saved);
    }

    private ClubSessionAnalysisResponseDto analyzeAndPersist(Club club) {
        Snapshot snapshot = buildSnapshot(club);
        ClubHealthMetricsDto metrics = buildMetrics(club, snapshot);
        double healthScore = aiEngine.computeHealthScore(metrics);
        String interpretation = aiEngine.interpretScore(healthScore);
        List<String> issues = aiEngine.detectIssues(metrics);
        String summary = aiEngine.buildSummarySentence(metrics, healthScore, issues);

        engagementScoreRepository.save(EngagementScore.builder()
                .clubId(club.getId())
                .healthScore(healthScore)
                .engagementRate(metrics.engagementRate())
                .attendanceRate(metrics.attendanceRate())
                .activityCompletionRate(metrics.activityCompletionRate())
                .averageLevelProgression(metrics.averageLevelProgression())
                .speakingParticipationRate(metrics.speakingParticipationRate())
                .inactivityRate(metrics.inactivityRate())
                .interpretation(interpretation)
                .calculatedAt(LocalDateTime.now())
                .build());

        return new ClubSessionAnalysisResponseDto(
                club.getId(),
                club.getTitle(),
                healthScore,
                interpretation,
                metrics,
                issues,
                summary,
                LocalDateTime.now()
        );
    }

    private void ensureRecommendations(Club club, List<String> issues, ClubHealthMetricsDto metrics) {
        List<RuleBasedClubAiEngineService.RecommendationBlueprint> drafts = aiEngine.buildRecommendations(metrics, issues);
        LocalDateTime dedupeCutoff = LocalDateTime.now().minusDays(7);
        List<RecommendationStatus> activeStatuses = List.of(RecommendationStatus.PENDING, RecommendationStatus.SAVED);

        for (RuleBasedClubAiEngineService.RecommendationBlueprint draft : drafts) {
            boolean exists = aiRecommendationRepository
                    .findTop1ByClubIdAndTitleAndStatusInAndCreatedAtAfter(
                            club.getId(),
                            draft.title(),
                            activeStatuses,
                            dedupeCutoff
                    )
                    .isPresent();
            if (exists) {
                continue;
            }

            aiRecommendationRepository.save(AiRecommendation.builder()
                    .clubId(club.getId())
                    .title(draft.title())
                    .description(draft.description())
                    .priority(draft.priority())
                    .status(RecommendationStatus.PENDING)
                    .reasoning(draft.reasoning())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build());
        }
    }

    private Snapshot buildSnapshot(Club club) {
        List<ClubMember> members = clubMemberRepository.findByClubId(club.getId());
        List<ClubSession> sessions = clubSessionRepository.findTop12ByClubIdOrderBySessionDateDesc(club.getId());
        List<ClubActivity> activities = clubActivityRepository.findTop20ByClubIdOrderByCreatedAtDesc(club.getId());
        return new Snapshot(members, sessions, activities);
    }

    private ClubHealthMetricsDto buildMetrics(Club club, Snapshot snapshot) {
        int totalMembers = Math.max(snapshot.members().size(), safeInt(club.getMemberCount()));
        if (totalMembers == 0) {
            totalMembers = 1;
        }

        int activeMembers = (int) snapshot.members().stream().filter(ClubMember::isActive).count();
        if (snapshot.members().isEmpty()) {
            activeMembers = Math.max(1, (int) Math.round(totalMembers * 0.62));
        }
        int inactiveMembers = Math.max(0, totalMembers - activeMembers);

        double engagementRate = ratio(activeMembers, totalMembers);
        double attendanceRate = computeAttendanceRate(snapshot.sessions(), totalMembers);
        double completionRate = computeCompletionRate(snapshot.activities());
        double progression = computeAverageProgression(snapshot.members());
        double speakingRate = computeSpeakingRate(snapshot, totalMembers);
        double inactivityRate = ratio(inactiveMembers, totalMembers);

        return new ClubHealthMetricsDto(
                totalMembers,
                activeMembers,
                inactiveMembers,
                round(engagementRate),
                round(attendanceRate),
                round(completionRate),
                round(progression),
                round(speakingRate),
                round(inactivityRate)
        );
    }

    private List<ParticipationTrendPointDto> buildParticipationTrends(List<ClubSession> sessions, int totalMembers) {
        List<ClubSession> ordered = new ArrayList<>(sessions);
        ordered.sort(Comparator.comparing(ClubSession::getSessionDate));

        List<ParticipationTrendPointDto> trends = new ArrayList<>();
        int denominator = Math.max(1, totalMembers);
        for (ClubSession session : ordered) {
            double attendance = ratio(session.getAttendeeCount(), denominator);
            double speaking = ratio(session.getSpeakingParticipantsCount(), denominator);
            double index = round((attendance * 0.65) + (speaking * 0.35));
            trends.add(new ParticipationTrendPointDto(
                    session.getSessionDate().format(TREND_DATE),
                    round(attendance),
                    round(speaking),
                    index
            ));
        }
        return trends;
    }

    private double computeAttendanceRate(List<ClubSession> sessions, int totalMembers) {
        if (sessions == null || sessions.isEmpty()) {
            return 0;
        }
        double averageAttendees = sessions.stream().mapToInt(ClubSession::getAttendeeCount).average().orElse(0);
        return ratio(averageAttendees, Math.max(1, totalMembers));
    }

    private double computeCompletionRate(List<ClubActivity> activities) {
        if (activities == null || activities.isEmpty()) {
            return 0;
        }
        int assigned = activities.stream().mapToInt(ClubActivity::getAssignedMembers).sum();
        int completed = activities.stream().mapToInt(ClubActivity::getCompletedMembers).sum();
        return ratio(completed, Math.max(1, assigned));
    }

    private double computeAverageProgression(List<ClubMember> members) {
        if (members == null || members.isEmpty()) {
            return 0;
        }
        return members.stream()
                .mapToInt(member -> Math.max(0, member.getCurrentLevel() - member.getLevelAtJoin()))
                .average()
                .orElse(0);
    }

    private double computeSpeakingRate(Snapshot snapshot, int totalMembers) {
        if (snapshot.sessions() != null && !snapshot.sessions().isEmpty()) {
            double averageSpeaking = snapshot.sessions().stream()
                    .mapToInt(ClubSession::getSpeakingParticipantsCount)
                    .average()
                    .orElse(0);
            return ratio(averageSpeaking, Math.max(1, totalMembers));
        }
        if (snapshot.members() == null || snapshot.members().isEmpty()) {
            return 0;
        }
        long speakingMembers = snapshot.members().stream()
                .filter(member -> member.getSpeakingContributions() > 0)
                .count();
        return ratio(speakingMembers, Math.max(1, totalMembers));
    }

    private double computeStudentEngagementScore(ClubMember member, ClubHealthMetricsDto metrics, int pendingActivities) {
        double score = member.isActive() ? 58 : 34;
        score += Math.min(18, member.getSpeakingContributions() * 2.0);
        score += Math.min(16, Math.max(0, member.getCurrentLevel() - member.getLevelAtJoin()) * 4.0);
        if (pendingActivities > 0) {
            score -= Math.min(12, pendingActivities * 2.0);
        }
        score += metrics.engagementRate() * 0.12;
        return clamp(score, 0, 100);
    }

    private int estimatePendingActivities(List<ClubActivity> activities, double completionRate, boolean activeMember) {
        long publishedCount = activities.stream().filter(ClubActivity::isPublished).count();
        if (publishedCount == 0) {
            return 0;
        }
        int estimated = (int) Math.round(publishedCount * (1 - completionRate / 100.0));
        if (activeMember && estimated > 0) {
            estimated -= 1;
        }
        return Math.max(0, estimated);
    }

    private ClubMember syntheticMember(Long studentId) {
        Long baseStudentId = studentId == null ? 1L : studentId;
        int seed = Math.abs(baseStudentId.hashCode());
        int baseLevel = 1 + (seed % 3);
        return ClubMember.builder()
                .studentId(studentId)
                .active(seed % 2 == 0)
                .levelAtJoin(baseLevel)
                .currentLevel(baseLevel + (seed % 3))
                .speakingContributions(seed % 5)
                .build();
    }

    private Club getClubOrThrow(String clubIdOrSlug) {
        String lookup = clean(clubIdOrSlug);
        if (lookup.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "clubId is required");
        }
        return clubRepository.findById(lookup)
                .or(() -> clubRepository.findBySlug(lookup))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Club not found"));
    }

    private ClubRecommendationDto toRecommendationDto(AiRecommendation recommendation) {
        return new ClubRecommendationDto(
                recommendation.getId(),
                recommendation.getTitle(),
                recommendation.getDescription(),
                recommendation.getPriority(),
                recommendation.getStatus(),
                recommendation.getReasoning(),
                recommendation.getCreatedAt(),
                recommendation.getUpdatedAt()
        );
    }

    private RecommendationActionHistoryDto toActionHistoryDto(AiRecommendationActionHistory history) {
        return new RecommendationActionHistoryDto(
                history.getRecommendationId(),
                history.getStatus(),
                history.getAdminId(),
                history.getNote(),
                history.getActedAt()
        );
    }

    private ClubActivityFeedItemDto toFeedDto(ClubActivity activity) {
        return new ClubActivityFeedItemDto(
                activity.getId(),
                activity.getTitle(),
                activity.getDescription(),
                activity.getActivityType(),
                activity.getDifficulty(),
                activity.isPublished(),
                round(ratio(activity.getCompletedMembers(), Math.max(1, activity.getAssignedMembers()))),
                activity.getCreatedAt()
        );
    }

    private GeneratedClubActivityResponseDto toGeneratedActivityDto(ClubActivity activity) {
        return new GeneratedClubActivityResponseDto(
                activity.getId(),
                activity.getTitle(),
                activity.getDescription(),
                activity.getDifficulty(),
                activity.getActivityType(),
                activity.isPublished(),
                activity.getCreatedAt()
        );
    }

    private int safeInt(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private double ratio(double numerator, double denominator) {
        if (denominator <= 0) {
            return 0;
        }
        return (numerator / denominator) * 100.0;
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private double round(double value) {
        return Double.parseDouble(String.format(Locale.ROOT, "%.2f", value));
    }

    private record Snapshot(
            List<ClubMember> members,
            List<ClubSession> sessions,
            List<ClubActivity> activities
    ) {
    }
}
