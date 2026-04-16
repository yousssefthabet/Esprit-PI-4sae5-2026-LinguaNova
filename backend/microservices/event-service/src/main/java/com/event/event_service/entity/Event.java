package com.event.event_service.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @JsonProperty("event_title")
    @Column(name = "event_title", nullable = false)
    private String eventTitle;

    @NotBlank
    @JsonProperty("session_description")
    @Column(name = "session_description", nullable = false, columnDefinition = "TEXT")
    private String sessionDescription;

    @NotBlank
    @Column(nullable = false)
    private String category;

    @NotNull
    @JsonProperty("event_type")
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @NotNull
    @JsonProperty("event_date")
    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @NotNull
    @JsonProperty("start_at")
    @Column(name = "start_at", nullable = false)
    private LocalTime startAt;

    @NotNull
    @JsonProperty("ends_at")
    @Column(name = "ends_at", nullable = false)
    private LocalTime endsAt;

    @JsonProperty("virtual_classroom")
    @Column(name = "virtual_classroom")
    private Boolean virtualClassroom;

    @JsonProperty("meeting_link")
    @Column(name = "meeting_link")
    private String meetingLink;

    @JsonProperty("instructor_id")
    @Column(name = "instructor_id")
    private Long instructorId;

    @JsonProperty("max_attendees")
    @Column(name = "max_attendees")
    private Integer maxAttendees;

    @JsonProperty("image_url")
    @Lob
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column
    private Double latitude;

    @JsonProperty("location_name")
    @Column(name = "location_name")
    private String locationName;

    @Column
    private Double longitude;
}

