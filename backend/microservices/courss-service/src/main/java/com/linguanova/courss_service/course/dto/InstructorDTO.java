package com.linguanova.courss_service.course.dto;

import lombok.Data;

@Data
public class InstructorDTO {
    private String id;
    private String name;
    private String title;
    private String avatar;
    private String bio;
    private Integer coursesCount;
    private Integer studentsCount;
    private Double rating;
}
