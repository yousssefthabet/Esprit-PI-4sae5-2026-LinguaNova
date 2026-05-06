package com.clubs.clubs_service.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.clubs.clubs_service.dto.clubai.ClubDashboardResponseDto;
import com.clubs.clubs_service.dto.clubai.ClubEngagementResponseDto;
import com.clubs.clubs_service.dto.clubai.ClubHealthMetricsDto;
import com.clubs.clubs_service.dto.clubai.ClubRecommendationDto;
import com.clubs.clubs_service.dto.clubai.GenerateClubActivityRequestDto;
import com.clubs.clubs_service.dto.clubai.GeneratedClubActivityResponseDto;
import com.clubs.clubs_service.dto.clubai.RecommendationStatusUpdateRequestDto;
import com.clubs.clubs_service.entity.ActivityDifficulty;
import com.clubs.clubs_service.entity.ClubActivityType;
import com.clubs.clubs_service.entity.RecommendationPriority;
import com.clubs.clubs_service.entity.RecommendationStatus;
import com.clubs.clubs_service.service.clubai.ClubAiDashboardService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class ClubAiControllerTest {

    @Mock
    private ClubAiDashboardService clubAiDashboardService;

    @InjectMocks
    private ClubAiController clubAiController;

    @Test
    void getDashboard_shouldReturnDashboard() {
        ClubDashboardResponseDto dashboard = new ClubDashboardResponseDto(
                "english-conversation",
                "English Conversation Club",
                88.0,
                "Healthy",
                metrics(),
                List.of(),
                List.of(),
                List.of(),
                "Stable",
                "Stable",
                List.of()
        );
        when(clubAiDashboardService.getDashboard("english-conversation")).thenReturn(dashboard);

        ResponseEntity<ClubDashboardResponseDto> response = clubAiController.getDashboard("english-conversation");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dashboard, response.getBody());
    }

    @Test
    void generateActivity_shouldReturnCreatedActivity() {
        GenerateClubActivityRequestDto request = new GenerateClubActivityRequestDto(
                ClubActivityType.ROLE_PLAY_PROMPT,
                ActivityDifficulty.BEGINNER,
                "speaking"
        );
        GeneratedClubActivityResponseDto generated = new GeneratedClubActivityResponseDto(
                10L,
                "Role-play Sprint",
                "Pair speaking activity",
                ActivityDifficulty.BEGINNER,
                ClubActivityType.ROLE_PLAY_PROMPT,
                false,
                LocalDateTime.of(2026, 5, 6, 10, 0)
        );
        when(clubAiDashboardService.generateActivity("english-conversation", request)).thenReturn(generated);

        ResponseEntity<GeneratedClubActivityResponseDto> response =
                clubAiController.generateActivity("english-conversation", request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(generated, response.getBody());
    }

    @Test
    void updateRecommendationStatus_shouldDelegateToService() {
        RecommendationStatusUpdateRequestDto request = new RecommendationStatusUpdateRequestDto(
                RecommendationStatus.APPLIED,
                "admin",
                "Completed"
        );
        ClubRecommendationDto updated = new ClubRecommendationDto(
                1L,
                "Schedule a live speaking session",
                "Run a live room",
                RecommendationPriority.HIGH,
                RecommendationStatus.APPLIED,
                "Low speaking",
                LocalDateTime.of(2026, 5, 6, 9, 0),
                LocalDateTime.of(2026, 5, 6, 10, 0)
        );
        when(clubAiDashboardService.updateRecommendationStatus(1L, request)).thenReturn(updated);

        ResponseEntity<ClubRecommendationDto> response = clubAiController.updateRecommendationStatus(1L, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updated, response.getBody());
        verify(clubAiDashboardService).updateRecommendationStatus(1L, request);
    }

    @Test
    void getEngagement_shouldReturnEngagement() {
        ClubEngagementResponseDto engagement = new ClubEngagementResponseDto(
                "english-conversation",
                "English Conversation Club",
                90,
                10,
                90.0,
                List.of(),
                "Improving"
        );
        when(clubAiDashboardService.getEngagement("english-conversation")).thenReturn(engagement);

        ResponseEntity<ClubEngagementResponseDto> response = clubAiController.getEngagement("english-conversation");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(engagement, response.getBody());
    }

    private ClubHealthMetricsDto metrics() {
        return new ClubHealthMetricsDto(100, 80, 20, 80, 75, 70, 2.0, 65, 10);
    }
}
