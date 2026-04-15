package com.linguanova.courss_service.course.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.linguanova.courss_service.course.model.LessonType;
import lombok.Data;

@Data
public class LessonDTO {
    private String id;
    private String title;
    private LessonType type = LessonType.VIDEO;
    private Boolean isPreview;
    private String fileUrl;
    private String fileName;
    private Integer order;

    @JsonSetter
    public void setType(Object value) {
        if (value == null) {
            this.type = LessonType.VIDEO;
            return;
        }
        if (value instanceof LessonType) {
            this.type = (LessonType) value;
            return;
        }
        String s = value.toString().trim().toUpperCase();
        try {
            this.type = LessonType.valueOf(s);
        } catch (IllegalArgumentException e) {
            this.type = LessonType.VIDEO;
        }
    }
}
