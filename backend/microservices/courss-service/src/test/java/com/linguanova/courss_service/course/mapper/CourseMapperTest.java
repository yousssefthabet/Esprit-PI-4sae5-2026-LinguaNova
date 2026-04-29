package com.linguanova.courss_service.course.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linguanova.courss_service.course.dto.CourseRequest;
import com.linguanova.courss_service.course.dto.CourseResponse;
import com.linguanova.courss_service.course.dto.LessonDTO;
import com.linguanova.courss_service.course.dto.QuestionDTO;
import com.linguanova.courss_service.course.dto.QuizDTO;
import com.linguanova.courss_service.course.dto.SectionDTO;
import com.linguanova.courss_service.course.model.Course;
import com.linguanova.courss_service.course.model.CourseCategory;
import com.linguanova.courss_service.course.model.CourseLevel;
import com.linguanova.courss_service.course.model.LessonType;
import com.linguanova.courss_service.course.model.QuestionType;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;

class CourseMapperTest {

    private final CourseMapper courseMapper = new CourseMapper(new ObjectMapper());

    @Test
    void fromRequest_shouldTrimValuesAndApplyDefaults() {
        CourseRequest request = new CourseRequest();
        request.setTitle("  English Basics  ");
        request.setShortDescription("  Short  ");
        request.setDescription("  Description  ");
        request.setPrice(-10);
        request.setLanguage(null);

        Course course = courseMapper.fromRequest(request, "teacher-1", "Teacher One");

        assertEquals("English Basics", course.getTitle());
        assertEquals("Short", course.getShortDescription());
        assertEquals("Description", course.getDescription());
        assertEquals(0.0, course.getPrice());
        assertEquals("English", course.getLanguage());
        assertEquals("teacher-1", course.getInstructorId());
        assertEquals("Teacher One", course.getInstructorName());
        assertEquals(CourseCategory.ENGLISH_LANGUAGE, course.getCategory());
        assertEquals(CourseLevel.BEGINNER, course.getLevel());
    }

    @Test
    void fromRequest_shouldMapSyllabusAndQuizChildren() {
        LessonDTO lesson = new LessonDTO();
        lesson.setTitle(" Intro video ");
        lesson.setType(LessonType.VIDEO);
        lesson.setIsPreview(true);
        lesson.setFileName("intro.mp4");
        lesson.setFileUrl("/files/intro.mp4");

        SectionDTO section = new SectionDTO();
        section.setTitle(" Module 1 ");
        section.setLessons(List.of(lesson));

        QuestionDTO question = new QuestionDTO();
        question.setText("Choose the answer");
        question.setType(QuestionType.MULTIPLE_CHOICE);
        question.setOptions(List.of("A", "B"));
        question.setCorrectAnswer("A");
        question.setPoints(5);

        QuizDTO quiz = new QuizDTO();
        quiz.setTitle(" Quiz 1 ");
        quiz.setPassingScore(80);
        quiz.setQuestions(List.of(question));

        CourseRequest request = new CourseRequest();
        request.setTitle("Course");
        request.setSyllabus(List.of(section));
        request.setQuizzes(List.of(quiz));

        Course course = courseMapper.fromRequest(request, "teacher-1", "Teacher One");

        assertEquals(1, course.getModules().size());
        assertEquals("Module 1", course.getModules().get(0).getTitle());
        assertSame(course, course.getModules().get(0).getCourse());
        assertEquals("Intro video", course.getModules().get(0).getLessons().get(0).getTitle());
        assertEquals(1, course.getQuizzes().size());
        assertEquals("Quiz 1", course.getQuizzes().get(0).getTitle());
        assertEquals(1, course.getQuizzes().get(0).getQuestions().size());
        assertEquals("[\"A\",\"B\"]", course.getQuizzes().get(0).getQuestions().get(0).getOptions());
    }

    @Test
    void toResponse_shouldMapInstructorSyllabusAndQuiz() {
        CourseRequest request = new CourseRequest();
        request.setTitle("Course");
        Course course = courseMapper.fromRequest(request, "teacher-1", "Teacher One");
        course.setId("course-1");
        course.setStudentsCount(12);
        course.setRating(4.5);
        course.setReviewsCount(3);

        CourseResponse response = courseMapper.toResponse(course);

        assertEquals("course-1", response.getId());
        assertEquals("Course", response.getTitle());
        assertEquals("teacher-1", response.getInstructor().getId());
        assertEquals("Teacher One", response.getInstructor().getName());
        assertEquals(12, response.getStudentsCount());
        assertFalse(response.getIsPublished());
    }

    @Test
    void courseRequestSetters_shouldParseInvalidValuesToDefaults() {
        CourseRequest request = new CourseRequest();
        request.setCategory("not a category");
        request.setLevel("not a level");
        request.setPrice(null);

        assertEquals(CourseCategory.ENGLISH_LANGUAGE, request.getCategory());
        assertEquals(CourseLevel.BEGINNER, request.getLevel());
        assertEquals(0.0, request.getPrice());
    }
}
