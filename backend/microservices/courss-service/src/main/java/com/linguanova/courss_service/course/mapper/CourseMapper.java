package com.linguanova.courss_service.course.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linguanova.courss_service.course.dto.*;
import com.linguanova.courss_service.course.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static com.linguanova.courss_service.course.model.LessonType.VIDEO;

@Component
@RequiredArgsConstructor
public class CourseMapper {

    private final ObjectMapper objectMapper;

    public CourseResponse toResponse(Course course) {
        CourseResponse dto = new CourseResponse();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setShortDescription(course.getShortDescription());
        dto.setDescription(course.getDescription());
        dto.setImage(course.getImage());
        dto.setCategory(course.getCategory());
        dto.setLevel(course.getLevel());
        dto.setPrice(course.getPrice());
        dto.setIsPublished(course.getIsPublished());
        dto.setLanguage(course.getLanguage());
        dto.setStudentsCount(course.getStudentsCount());
        dto.setRating(course.getRating());
        dto.setReviewsCount(course.getReviewsCount());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());

        InstructorDTO instructor = new InstructorDTO();
        instructor.setId(course.getInstructorId());
        instructor.setName(course.getInstructorName());
        dto.setInstructor(instructor);

        if (course.getModules() != null && !course.getModules().isEmpty()) {
            dto.setSyllabus(course.getModules().stream()
                .map(this::moduleToSectionDTO)
                .collect(Collectors.toList()));
        }
        if (course.getQuizzes() != null && !course.getQuizzes().isEmpty()) {
            dto.setQuizzes(course.getQuizzes().stream()
                .map(this::toQuizDTO)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    private SectionDTO moduleToSectionDTO(CourseModule module) {
        SectionDTO dto = new SectionDTO();
        dto.setId(module.getId());
        dto.setTitle(module.getTitle());
        if (module.getLessons() != null) {
            dto.setLessons(module.getLessons().stream()
                .map(this::toLessonDTO)
                .collect(Collectors.toList()));
        }
        return dto;
    }

    public LessonDTO toLessonDTO(Lesson lesson) {
        LessonDTO dto = new LessonDTO();
        dto.setId(lesson.getId());
        dto.setTitle(lesson.getTitle());
        dto.setType(lesson.getType());
        dto.setIsPreview(lesson.getIsPreview());
        dto.setFileUrl(lesson.getFileUrl());
        dto.setFileName(lesson.getFileName());
        dto.setOrder(lesson.getLessonOrder());
        return dto;
    }

    public QuizDTO toQuizDTO(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setPassingScore(quiz.getPassingScore());
        if (quiz.getQuestions() != null) {
            dto.setQuestions(quiz.getQuestions().stream()
                .map(this::toQuestionDTO)
                .collect(Collectors.toList()));
        }
        return dto;
    }

    public QuestionDTO toQuestionDTO(Question q) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(q.getId());
        dto.setText(q.getText());
        dto.setType(q.getType());
        dto.setOptions(parseJsonList(q.getOptions()));
        dto.setCorrectAnswer(q.getCorrectAnswer());
        dto.setExplanation(q.getExplanation());
        dto.setPoints(q.getPoints());
        return dto;
    }

    public String toJson(List<String> list) {
        if (list == null) return "[]";
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }

    private List<String> parseJsonList(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private String optionsToJson(List<String> options) {
        if (options == null) return "[]";
        try {
            return objectMapper.writeValueAsString(options);
        } catch (Exception e) {
            return "[]";
        }
    }

    public Course fromRequest(CourseRequest req, String instructorId, String instructorName) {
        String title = req.getTitle() != null ? req.getTitle().trim() : "Untitled Course";
        if (title.isEmpty()) title = "Untitled Course";
        Course course = Course.builder()
            .title(title)
            .shortDescription(req.getShortDescription() != null ? req.getShortDescription().trim() : "")
            .description(req.getDescription() != null ? req.getDescription().trim() : "")
            .image(req.getImage() != null ? req.getImage() : "")
            .category(req.getCategory() != null ? req.getCategory() : CourseCategory.ENGLISH_LANGUAGE)
            .level(req.getLevel() != null ? req.getLevel() : CourseLevel.BEGINNER)
            .price(req.getPrice() != null && req.getPrice() >= 0 ? req.getPrice() : 0.0)
            .isPublished(req.getIsPublished() != null ? req.getIsPublished() : false)
            .language(req.getLanguage() != null ? req.getLanguage() : "English")
            .instructorId(instructorId != null ? instructorId : "dev-instructor")
            .instructorName(instructorName != null ? instructorName : "Dev Instructor")
            .build();

        List<CourseModule> modules = new ArrayList<>();
        if (req.getSyllabus() != null && !req.getSyllabus().isEmpty()) {
            for (int i = 0; i < req.getSyllabus().size(); i++) {
                SectionDTO sDto = req.getSyllabus().get(i);
                if (sDto == null) continue;
                CourseModule courseModule = CourseModule.builder()
                    .title(sDto.getTitle() != null ? sDto.getTitle().trim() : "")
                    .moduleOrder(i + 1)
                    .course(course)
                    .build();
                List<Lesson> lessons = new ArrayList<>();
                if (sDto.getLessons() != null && !sDto.getLessons().isEmpty()) {
                    for (int j = 0; j < sDto.getLessons().size(); j++) {
                        LessonDTO lDto = sDto.getLessons().get(j);
                        if (lDto == null) continue;
                        Lesson lesson = Lesson.builder()
                            .title(lDto.getTitle() != null ? lDto.getTitle().trim() : "")
                            .type(lDto.getType() != null ? lDto.getType() : VIDEO)
                            .isPreview(lDto.getIsPreview() != null ? lDto.getIsPreview() : false)
                            .fileName(lDto.getFileName())
                            .fileUrl(lDto.getFileUrl())
                            .lessonOrder(j + 1)
                            .module(courseModule)
                            .build();
                        lessons.add(lesson);
                    }
                }
                courseModule.setLessons(lessons);
                modules.add(courseModule);
            }
        }
        course.setModules(modules);

        List<Quiz> quizzes = new ArrayList<>();
        if (req.getQuizzes() != null && !req.getQuizzes().isEmpty()) {
            for (QuizDTO qDto : req.getQuizzes()) {
                if (qDto == null) continue;
                Quiz quiz = Quiz.builder()
                    .title(qDto.getTitle() != null ? qDto.getTitle().trim() : "Quiz")
                    .passingScore(qDto.getPassingScore() != null ? qDto.getPassingScore() : 70)
                    .course(course)
                    .build();
                List<Question> questions = new ArrayList<>();
                if (qDto.getQuestions() != null && !qDto.getQuestions().isEmpty()) {
                    for (QuestionDTO quDto : qDto.getQuestions()) {
                        if (quDto == null) continue;
                        Question question = Question.builder()
                            .text(quDto.getText() != null ? quDto.getText() : "")
                            .type(quDto.getType() != null ? quDto.getType() : QuestionType.MULTIPLE_CHOICE)
                            .options(optionsToJson(quDto.getOptions()))
                            .correctAnswer(quDto.getCorrectAnswer())
                            .explanation(quDto.getExplanation())
                            .points(quDto.getPoints() != null ? quDto.getPoints() : 10)
                            .quiz(quiz)
                            .build();
                        questions.add(question);
                    }
                }
                quiz.setQuestions(questions);
                quizzes.add(quiz);
            }
        }
        course.setQuizzes(quizzes);

        return course;
    }
}
