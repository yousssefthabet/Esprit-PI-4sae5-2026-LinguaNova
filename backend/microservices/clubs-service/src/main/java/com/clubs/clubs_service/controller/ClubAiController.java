package com.clubs.clubs_service.controller;

import com.clubs.clubs_service.dto.clubai.ClubActivityFeedItemDto;
import com.clubs.clubs_service.dto.clubai.ClubDashboardResponseDto;
import com.clubs.clubs_service.dto.clubai.ClubEngagementResponseDto;
import com.clubs.clubs_service.dto.clubai.ClubRecommendationDto;
import com.clubs.clubs_service.dto.clubai.ClubSessionAnalysisResponseDto;
import com.clubs.clubs_service.dto.clubai.GenerateClubActivityRequestDto;
import com.clubs.clubs_service.dto.clubai.GeneratedClubActivityResponseDto;
import com.clubs.clubs_service.dto.clubai.RecommendationStatusUpdateRequestDto;
import com.clubs.clubs_service.dto.clubai.StudentClubInsightResponseDto;
import com.clubs.clubs_service.service.clubai.ClubAiDashboardService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping({"/api/ai/club", "/api/events/ai/club"})
@RequiredArgsConstructor
public class ClubAiController {

    private final ClubAiDashboardService clubAiDashboardService;

    @GetMapping("/engagement/{clubId}")
    public ResponseEntity<ClubEngagementResponseDto> getEngagement(
            @PathVariable("clubId") @NotBlank String clubId
    ) {
        return ResponseEntity.ok(clubAiDashboardService.getEngagement(clubId));
    }

    @PostMapping("/generate-activity/{clubId}")
    public ResponseEntity<GeneratedClubActivityResponseDto> generateActivity(
            @PathVariable("clubId") @NotBlank String clubId,
            @RequestBody(required = false) GenerateClubActivityRequestDto request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clubAiDashboardService.generateActivity(clubId, request));
    }

    @GetMapping("/analyze-session/{clubId}")
    public ResponseEntity<ClubSessionAnalysisResponseDto> analyzeSession(
            @PathVariable("clubId") @NotBlank String clubId
    ) {
        return ResponseEntity.ok(clubAiDashboardService.analyzeSessions(clubId));
    }

    @GetMapping("/recommend-actions/{clubId}")
    public ResponseEntity<List<ClubRecommendationDto>> getRecommendations(
            @PathVariable("clubId") @NotBlank String clubId
    ) {
        return ResponseEntity.ok(clubAiDashboardService.getRecommendations(clubId));
    }

    @GetMapping("/dashboard/{clubId}")
    public ResponseEntity<ClubDashboardResponseDto> getDashboard(
            @PathVariable("clubId") @NotBlank String clubId
    ) {
        return ResponseEntity.ok(clubAiDashboardService.getDashboard(clubId));
    }

    @GetMapping("/activities/{clubId}")
    public ResponseEntity<List<ClubActivityFeedItemDto>> getActivityFeed(
            @PathVariable("clubId") @NotBlank String clubId
    ) {
        return ResponseEntity.ok(clubAiDashboardService.getActivityFeed(clubId));
    }

    @GetMapping("/student-insights/{clubId}/{studentId}")
    public ResponseEntity<StudentClubInsightResponseDto> getStudentInsights(
            @PathVariable("clubId") @NotBlank String clubId,
            @PathVariable("studentId") @NotNull Long studentId
    ) {
        return ResponseEntity.ok(clubAiDashboardService.getStudentInsights(clubId, studentId));
    }

    @PatchMapping("/recommendations/{recommendationId}/status")
    public ResponseEntity<ClubRecommendationDto> updateRecommendationStatus(
            @PathVariable("recommendationId") @NotNull Long recommendationId,
            @Valid @RequestBody RecommendationStatusUpdateRequestDto request
    ) {
        return ResponseEntity.ok(clubAiDashboardService.updateRecommendationStatus(recommendationId, request));
    }

    @PatchMapping("/activities/{activityId}/publish")
    public ResponseEntity<GeneratedClubActivityResponseDto> publishActivity(
            @PathVariable("activityId") @NotNull Long activityId
    ) {
        return ResponseEntity.ok(clubAiDashboardService.publishActivity(activityId));
    }
}

