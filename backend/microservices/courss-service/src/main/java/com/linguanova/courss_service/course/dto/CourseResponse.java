package com.linguanova.courss_service.course.dto;

import com.linguanova.courss_service.course.model.CourseCategory;
import com.linguanova.courss_service.course.model.CourseLevel;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CourseResponse {
    private String id;
    private String title;
    private String shortDescription;
    private String description;
    private InstructorDTO instructor;
    private String image;
    private Double price;
    private Double discountedPrice;
    private CourseCategory category;
    private CourseLevel level;
    private Integer studentsCount;
    private Double rating;
    private Integer reviewsCount;
    private String language;
    private List<String> subtitles;
    private List<SectionDTO> syllabus;
    private List<QuizDTO> quizzes;
    private List<String> requirements;
    private List<String> learningOutcomes;
    private List<String> tags;
    private Boolean isFeatured;
    private Boolean isPublished;
    private String displayTag;
    private String priceSuffix;
    private Integer progress; // only for enrolled courses
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
