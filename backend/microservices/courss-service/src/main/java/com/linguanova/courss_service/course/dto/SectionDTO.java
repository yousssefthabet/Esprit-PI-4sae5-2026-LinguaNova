package com.linguanova.courss_service.course.dto;

import lombok.Data;
import java.util.List;

@Data
public class SectionDTO {
    private String id;
    private String title;
    private List<LessonDTO> lessons;
}
