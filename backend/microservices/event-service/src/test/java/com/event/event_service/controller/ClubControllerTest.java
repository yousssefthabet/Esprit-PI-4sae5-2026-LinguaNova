package com.event.event_service.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.event.event_service.entity.Club;
import com.event.event_service.entity.ClubStatus;
import com.event.event_service.service.ClubService;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class ClubControllerTest {

    @Mock
    private ClubService clubService;

    @InjectMocks
    private ClubController clubController;

    @Test
    void getAll_shouldReturnOkWithClubs() {
        List<Club> clubs = List.of(
                Club.builder()
                        .id("club-conversation")
                        .slug("english-conversation")
                        .title("English Conversation Club")
                        .status(ClubStatus.ACTIVE)
                        .build()
        );
        when(clubService.getAll()).thenReturn(clubs);

        ResponseEntity<List<Club>> response = clubController.getAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(clubs, response.getBody());
        verify(clubService).getAll();
    }

    @Test
    void getAll_shouldReturnOkWithEmptyList() {
        when(clubService.getAll()).thenReturn(Collections.emptyList());

        ResponseEntity<List<Club>> response = clubController.getAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(clubService).getAll();
    }

    @Test
    void create_shouldReturnCreatedClub() {
        Club payload = Club.builder()
                .title("English Conversation Club")
                .description("Desc")
                .category("Conversation")
                .instructorName("Teacher")
                .memberCount(10)
                .status(ClubStatus.ACTIVE)
                .build();

        Club created = Club.builder()
                .id("club-english-conversation")
                .slug("english-conversation")
                .title("English Conversation Club")
                .description("Desc")
                .category("Conversation")
                .instructorName("Teacher")
                .memberCount(10)
                .status(ClubStatus.ACTIVE)
                .build();

        when(clubService.create(payload)).thenReturn(created);

        ResponseEntity<Club> response = clubController.create(payload);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(created, response.getBody());
        verify(clubService).create(payload);
    }

    @Test
    void update_shouldReturnUpdatedClub() {
        Club payload = Club.builder()
                .title("Updated Club")
                .description("Updated")
                .category("Updated")
                .instructorName("Updated teacher")
                .memberCount(23)
                .status(ClubStatus.ACTIVE)
                .build();

        Club updated = Club.builder()
                .id("club-conversation")
                .slug("updated-club")
                .title("Updated Club")
                .description("Updated")
                .category("Updated")
                .instructorName("Updated teacher")
                .memberCount(23)
                .status(ClubStatus.ACTIVE)
                .build();

        when(clubService.update("club-conversation", payload)).thenReturn(updated);

        ResponseEntity<Club> response = clubController.update("club-conversation", payload);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updated, response.getBody());
        verify(clubService).update("club-conversation", payload);
    }

    @Test
    void delete_shouldReturnNoContent() {
        ResponseEntity<Void> response = clubController.delete("club-conversation");

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(clubService).delete("club-conversation");
    }
}
