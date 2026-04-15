package com.linguanova.courss_service.course.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.linguanova.courss_service.course.model.CourseCategory;
import com.linguanova.courss_service.course.model.CourseLevel;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class CourseRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 255)
    private String title;

    @Size(max = 500)
    private String shortDescription;

    @Size(max = 10000)
    private String description;

    private CourseCategory category = CourseCategory.ENGLISH_LANGUAGE;

    private CourseLevel level = CourseLevel.BEGINNER;

    @Min(0)
    private Double price = 0.0;

    private Double discountedPrice;
    /** Course Thumbnail: image URL or base64 data URL from frontend. Stored in DB as LONGTEXT. */
    private String image;
    private Boolean isPublished = false;
    private String language = "English";
    private List<String> subtitles;
    private List<String> requirements;
    private List<String> learningOutcomes;
    private List<String> tags;
    private List<SectionDTO> syllabus;
    private List<QuizDTO> quizzes;

    /** Accept category as string (enum name from frontend) and parse to enum. */
    @JsonSetter
    public void setCategory(Object value) {
        if (value == null) {
            this.category = CourseCategory.ENGLISH_LANGUAGE;
            return;
        }
        if (value instanceof CourseCategory) {
            this.category = (CourseCategory) value;
            return;
        }
        String s = value.toString().trim().toUpperCase().replace(" ", "_");
        try {
            this.category = CourseCategory.valueOf(s);
        } catch (IllegalArgumentException e) {
            this.category = CourseCategory.ENGLISH_LANGUAGE;
        }
    }

    /** Accept level as string (enum name from frontend) and parse to enum. */
    @JsonSetter
    public void setLevel(Object value) {
        if (value == null) {
            this.level = CourseLevel.BEGINNER;
            return;
        }
        if (value instanceof CourseLevel) {
            this.level = (CourseLevel) value;
            return;
        }
        String s = value.toString().trim().toUpperCase().replace(" ", "_").replace("-", "_");
        try {
            this.level = CourseLevel.valueOf(s);
        } catch (IllegalArgumentException e) {
            this.level = CourseLevel.BEGINNER;
        }
    }

    /** Accept price as number (frontend may send integer). */
    @JsonSetter
    public void setPrice(Number value) {
        this.price = value == null ? 0.0 : value.doubleValue();
    }
}
