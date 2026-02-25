package com.linguanova.courss_service.course.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizDTO {
    private String id;
    private String title;
    private Integer passingScore = 70;
    private List<QuestionDTO> questions;
}
