package com.clubs.clubs_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.clubs.clubs_service.entity.Club;
import com.clubs.clubs_service.entity.ClubStatus;
import com.clubs.clubs_service.repository.ClubRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ClubServiceTest {

    @Mock
    private ClubRepository clubRepository;

    @InjectMocks
    private ClubService clubService;

    @Test
    void seedDefaultsIfEmpty_shouldDoNothingWhenRepositoryAlreadyContainsData() {
        when(clubRepository.count()).thenReturn(2L);

        clubService.seedDefaultsIfEmpty();

        verify(clubRepository, never()).saveAll(any());
    }

    @Test
    void seedDefaultsIfEmpty_shouldSeedDefaultClubsWhenRepositoryIsEmpty() {
        when(clubRepository.count()).thenReturn(0L);

        clubService.seedDefaultsIfEmpty();

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Club>> clubsCaptor = ArgumentCaptor.forClass(List.class);
        verify(clubRepository).saveAll(clubsCaptor.capture());

        List<Club> savedClubs = clubsCaptor.getValue();
        assertEquals(4, savedClubs.size());
        assertEquals("english-conversation", savedClubs.get(0).getSlug());
        assertEquals("book-storytelling", savedClubs.get(1).getSlug());
        assertEquals("drama-roleplay", savedClubs.get(2).getSlug());
        assertEquals("writing-grammar", savedClubs.get(3).getSlug());
        assertTrue(savedClubs.stream().allMatch(club -> club.getStatus() == ClubStatus.ACTIVE));
    }

    @Test
    void getAll_shouldReturnOrderedClubsFromRepository() {
        List<Club> clubs = List.of(
                Club.builder().id("club-a").slug("a").title("A").build(),
                Club.builder().id("club-b").slug("b").title("B").build()
        );
        when(clubRepository.findAllByOrderByIdAsc()).thenReturn(clubs);

        List<Club> result = clubService.getAll();

        assertSame(clubs, result);
        verify(clubRepository).findAllByOrderByIdAsc();
    }

    @Test
    void create_shouldGenerateIdSlugAndDefaults() {
        Club payload = Club.builder()
                .title("English Conversation Club")
                .description("Desc")
                .category("Conversation")
                .instructorName("Teacher")
                .memberCount(12)
                .build();

        when(clubRepository.existsById(any())).thenReturn(false);
        when(clubRepository.existsBySlug(any())).thenReturn(false);
        when(clubRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Club created = clubService.create(payload);

        assertNotNull(created.getId());
        assertEquals("club-english-conversation", created.getId());
        assertEquals("english-conversation", created.getSlug());
        assertEquals("/clubs/english-conversation", created.getActionRoute());
        assertEquals(ClubStatus.ACTIVE, created.getStatus());
        verify(clubRepository).save(any());
    }

    @Test
    void update_shouldKeepIdAndUpdateFields() {
        Club existing = Club.builder()
                .id("club-conversation")
                .slug("english-conversation")
                .title("Old title")
                .description("Old")
                .category("Old cat")
                .instructorName("Old teacher")
                .memberCount(10)
                .status(ClubStatus.ACTIVE)
                .build();

        Club payload = Club.builder()
                .title("Updated Club")
                .description("Updated description")
                .category("Updated category")
                .instructorName("Updated teacher")
                .memberCount(35)
                .status(ClubStatus.ARCHIVED)
                .build();

        when(clubRepository.findById("club-conversation")).thenReturn(Optional.of(existing));
        when(clubRepository.existsBySlugAndIdNot(any(), eq("club-conversation"))).thenReturn(false);
        when(clubRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Club updated = clubService.update("club-conversation", payload);

        assertEquals("club-conversation", updated.getId());
        assertEquals("updated", updated.getSlug());
        assertEquals("Updated Club", updated.getTitle());
        assertEquals(ClubStatus.ARCHIVED, updated.getStatus());
    }

    @Test
    void delete_shouldDeleteWhenClubExists() {
        when(clubRepository.existsById("club-conversation")).thenReturn(true);

        clubService.delete("club-conversation");

        verify(clubRepository).deleteById("club-conversation");
    }

    @Test
    void delete_shouldThrowWhenMissing() {
        when(clubRepository.existsById("missing")).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> clubService.delete("missing"));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }
}
