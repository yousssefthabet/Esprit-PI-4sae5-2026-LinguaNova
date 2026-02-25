package com.linguanova.courss_service.course.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.linguanova.courss_service.course.model.QuestionType;
import lombok.Data;
import java.util.List;

@Data
public class QuestionDTO {
    private String id;
    private String text;
    private QuestionType type = QuestionType.MULTIPLE_CHOICE;
    private List<String> options;
    private String correctAnswer;
    private String explanation;
    private Integer points = 10;

    @JsonSetter
    public void setType(Object value) {
        if (value == null) {
            this.type = QuestionType.MULTIPLE_CHOICE;
            return;
        }
        if (value instanceof QuestionType) {
            this.type = (QuestionType) value;
            return;
        }
        String s = value.toString().trim().toUpperCase().replace(" ", "_");
        try {
            this.type = QuestionType.valueOf(s);
        } catch (IllegalArgumentException e) {
            this.type = QuestionType.MULTIPLE_CHOICE;
        }
    }
}
