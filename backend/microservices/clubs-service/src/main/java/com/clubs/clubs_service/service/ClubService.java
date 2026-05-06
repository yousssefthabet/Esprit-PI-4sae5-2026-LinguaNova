package com.clubs.clubs_service.service;

import com.clubs.clubs_service.entity.Club;
import com.clubs.clubs_service.entity.ClubStatus;
import com.clubs.clubs_service.repository.ClubRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ClubService {

    private static final String DEFAULT_ICON = "club";
    private static final String DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop";

    private final ClubRepository clubRepository;

    @Transactional
    @PostConstruct
    public void seedDefaultsIfEmpty() {
        if (clubRepository.count() > 0) {
            normalizeLegacyData();
            return;
        }

        clubRepository.saveAll(List.of(
                Club.builder()
                        .id("club-conversation")
                        .slug("english-conversation")
                        .title("English Conversation Club")
                        .description("Practice speaking with peers in a supportive environment through interactive discussions and guided prompts.")
                        .category("Conversational")
                        .memberCount(840)
                        .imageUrl("https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&auto=format&fit=crop")
                        .icon("chat")
                        .instructorName("Sarah Drasner")
                        .status(ClubStatus.ACTIVE)
                        .actionLabel("Open AI conversation club")
                        .actionRoute("/clubs/english-conversation")
                        .build(),
                Club.builder()
                        .id("club-book-storytelling")
                        .slug("book-storytelling")
                        .title("Book & Storytelling Club")
                        .description("Improve reading comprehension and vocabulary with book sessions and storytelling activities.")
                        .category("Reading")
                        .memberCount(1205)
                        .imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop")
                        .icon("book")
                        .instructorName("Emma Wilson")
                        .status(ClubStatus.ACTIVE)
                        .actionLabel("Open Book & Storytelling club")
                        .actionRoute("/clubs/book-storytelling")
                        .build(),
                Club.builder()
                        .id("club-drama-roleplay")
                        .slug("drama-roleplay")
                        .title("Drama & Roleplay Club")
                        .description("Build confidence through practical scenarios and roleplay conversations.")
                        .category("Creative")
                        .memberCount(450)
                        .imageUrl("https://images.unsplash.com/photo-1533561089-13e551347012?q=80&w=400&auto=format&fit=crop")
                        .icon("drama")
                        .instructorName("John Doe")
                        .status(ClubStatus.ACTIVE)
                        .actionLabel("Open Drama & Roleplay club")
                        .actionRoute("/clubs/drama-roleplay")
                        .build(),
                Club.builder()
                        .id("club-writing-grammar")
                        .slug("writing-grammar")
                        .title("Writing & Grammar Club")
                        .description("Strengthen writing quality with grammar coaching, sentence structure practice, and clear feedback.")
                        .category("Writing")
                        .memberCount(610)
                        .imageUrl("https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop")
                        .icon("pen")
                        .instructorName("Alice Spencer")
                        .status(ClubStatus.ACTIVE)
                        .actionLabel("Open Writing & Grammar club")
                        .actionRoute("/clubs/writing-grammar")
                        .build()
        ));

        normalizeLegacyData();
    }

    @Transactional
    public List<Club> getAll() {
        return clubRepository.findAllByOrderByIdAsc();
    }

    @Transactional
    public Club create(Club payload) {
        Club club = new Club();
        club.setId(buildUniqueId(payload.getId(), payload.getSlug(), payload.getTitle()));
        applyEditableFields(club, payload, null);
        return clubRepository.save(club);
    }

    @Transactional
    public Club update(String id, Club payload) {
        Club existing = getById(id);
        applyEditableFields(existing, payload, existing.getId());
        return clubRepository.save(existing);
    }

    @Transactional
    public void delete(String id) {
        if (!clubRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Club not found");
        }
        clubRepository.deleteById(id);
    }

    private Club getById(String id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Club not found"));
    }

    private void applyEditableFields(Club target, Club payload, String currentId) {
        target.setTitle(requireText(payload.getTitle(), "title"));
        target.setDescription(requireText(payload.getDescription(), "description"));
        target.setCategory(requireText(payload.getCategory(), "category"));
        target.setInstructorName(requireText(payload.getInstructorName(), "instructor_name"));
        target.setMemberCount(Math.max(0, payload.getMemberCount() == null ? 0 : payload.getMemberCount()));
        target.setStatus(payload.getStatus() == null ? ClubStatus.ACTIVE : payload.getStatus());

        String candidateSlug = clean(payload.getSlug());
        if (candidateSlug.isBlank()) {
            candidateSlug = slugify(target.getTitle());
        }
        if (candidateSlug.isBlank()) {
            candidateSlug = slugify(target.getId());
        }
        target.setSlug(ensureUniqueSlug(candidateSlug, currentId));

        String image = clean(payload.getImageUrl());
        target.setImageUrl(image.isBlank() ? DEFAULT_IMAGE_URL : image);
        target.setLegacyImage(target.getImageUrl());

        String icon = clean(payload.getIcon());
        target.setIcon(icon.isBlank() ? DEFAULT_ICON : icon);

        String actionRoute = clean(payload.getActionRoute());
        if (actionRoute.isBlank()) {
            actionRoute = "/clubs/" + target.getSlug();
        } else if (!actionRoute.startsWith("/")) {
            actionRoute = "/" + actionRoute;
        }
        target.setActionRoute(actionRoute);

        String actionLabel = clean(payload.getActionLabel());
        if (actionLabel.isBlank()) {
            actionLabel = "Open " + target.getTitle();
        }
        target.setActionLabel(actionLabel);
    }

    private String buildUniqueId(String preferredId, String slug, String title) {
        String candidate = clean(preferredId);
        if (candidate.isBlank()) {
            String slugCandidate = clean(slug);
            if (slugCandidate.isBlank()) {
                slugCandidate = slugify(title);
            } else {
                slugCandidate = slugify(slugCandidate);
            }
            if (slugCandidate.isBlank()) {
                slugCandidate = "club";
            }
            candidate = "club-" + slugCandidate;
        }

        String uniqueId = candidate;
        int i = 2;
        while (clubRepository.existsById(uniqueId)) {
            uniqueId = candidate + "-" + i;
            i++;
        }
        return uniqueId;
    }

    private String ensureUniqueSlug(String preferredSlug, String currentId) {
        String base = slugify(preferredSlug);
        if (base.isBlank()) {
            base = "club";
        }

        String candidate = base;
        int i = 2;
        while (slugExistsForAnotherClub(candidate, currentId)) {
            candidate = base + "-" + i;
            i++;
        }
        return candidate;
    }

    private boolean slugExistsForAnotherClub(String slug, String currentId) {
        if (currentId == null) {
            return clubRepository.existsBySlug(slug);
        }
        return clubRepository.existsBySlugAndIdNot(slug, currentId);
    }

    private void normalizeLegacyData() {
        List<Club> clubs = clubRepository.findAllByOrderByIdAsc();
        if (clubs == null || clubs.isEmpty()) {
            return;
        }
        List<Club> toUpdate = new ArrayList<>();

        for (Club club : clubs) {
            String originalSlug = nullToEmpty(club.getSlug());
            String originalActionRoute = nullToEmpty(club.getActionRoute());
            String originalActionLabel = nullToEmpty(club.getActionLabel());
            String originalImageUrl = nullToEmpty(club.getImageUrl());
            String originalLegacyImage = nullToEmpty(club.getLegacyImage());
            String originalIcon = nullToEmpty(club.getIcon());
            Integer originalMemberCount = club.getMemberCount();

            String slug = originalSlug.isBlank() ? slugify(club.getTitle()) : slugify(originalSlug);
            if (slug.isBlank()) {
                slug = slugify(club.getId());
            }
            if (slug.isBlank()) {
                slug = "club";
            }
            slug = ensureUniqueSlug(slug, club.getId());
            club.setSlug(slug);

            String actionRoute = originalActionRoute.isBlank() ? "/clubs/" + slug : originalActionRoute;
            if (!actionRoute.startsWith("/")) {
                actionRoute = "/" + actionRoute;
            }
            club.setActionRoute(actionRoute);

            if (originalActionLabel.isBlank()) {
                club.setActionLabel("Open " + club.getTitle());
            }

            if (originalImageUrl.isBlank()) {
                if (!originalLegacyImage.isBlank()) {
                    club.setImageUrl(originalLegacyImage);
                } else {
                    club.setImageUrl(DEFAULT_IMAGE_URL);
                }
            }
            club.setLegacyImage(club.getImageUrl());

            if (originalIcon.isBlank()) {
                club.setIcon(DEFAULT_ICON);
            }

            if (club.getMemberCount() == null || club.getMemberCount() < 0) {
                club.setMemberCount(0);
            }

            if (club.getStatus() == null) {
                club.setStatus(ClubStatus.ACTIVE);
            }

            boolean changed =
                    !originalSlug.equals(club.getSlug())
                            || !originalActionRoute.equals(nullToEmpty(club.getActionRoute()))
                            || !originalActionLabel.equals(nullToEmpty(club.getActionLabel()))
                            || !originalImageUrl.equals(nullToEmpty(club.getImageUrl()))
                            || !originalLegacyImage.equals(nullToEmpty(club.getLegacyImage()))
                            || !originalIcon.equals(nullToEmpty(club.getIcon()))
                            || originalMemberCount == null
                            || originalMemberCount < 0;

            if (changed) {
                toUpdate.add(club);
            }
        }

        if (!toUpdate.isEmpty()) {
            clubRepository.saveAll(toUpdate);
        }
    }

    private String requireText(String value, String field) {
        String cleaned = clean(value);
        if (cleaned.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " is required");
        }
        return cleaned;
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private String slugify(String input) {
        String cleaned = clean(input).toLowerCase(Locale.ROOT);
        cleaned = cleaned.replaceAll("[^a-z0-9]+", "-");
        cleaned = cleaned.replaceAll("^-+", "").replaceAll("-+$", "");
        cleaned = cleaned.replaceAll("-club$", "");
        return cleaned;
    }
}
