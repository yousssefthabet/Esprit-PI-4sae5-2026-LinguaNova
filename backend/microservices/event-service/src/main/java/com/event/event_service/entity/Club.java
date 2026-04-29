package com.event.event_service.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clubs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

    @Id
    @Column(nullable = false, length = 120)
    private String id;

    @Column(nullable = false, length = 120)
    private String slug;

    @NotBlank
    @Column(nullable = false, length = 180)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(nullable = false, length = 80)
    private String category;

    @NotNull
    @JsonProperty("member_count")
    @Column(name = "member_count", nullable = false)
    private Integer memberCount;

    @Lob
    @JsonProperty("image_url")
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Lob
    @JsonIgnore
    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String legacyImage;

    @Column(nullable = false, length = 16)
    private String icon;

    @NotBlank
    @JsonProperty("instructor_name")
    @Column(name = "instructor_name", nullable = false, length = 120)
    private String instructorName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ClubStatus status;

    @JsonProperty("action_label")
    @Column(name = "action_label", length = 150)
    private String actionLabel;

    @JsonProperty("action_route")
    @Column(name = "action_route", length = 150)
    private String actionRoute;
}
