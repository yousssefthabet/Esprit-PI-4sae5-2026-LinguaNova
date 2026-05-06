package com.linguanova.courss_service.course.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Path;

class LessonFileServiceTest {

    @TempDir
    Path uploadDir;

    @Test
    void saveFile_shouldStoreFileWithSanitizedNameAndReturnPublicUrl() {
        LessonFileService service = new LessonFileService(uploadDir.toString());
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "My Lesson 01.pdf",
                "application/pdf",
                "content".getBytes()
        );

        String url = service.saveFile(file, "/PIproject");

        assertTrue(url.startsWith("/PIproject/api/courses/files/"));
        assertTrue(url.endsWith("-My_Lesson_01.pdf"));
    }

    @Test
    void saveFile_shouldRejectEmptyFile() {
        LessonFileService service = new LessonFileService(uploadDir.toString());
        MockMultipartFile file = new MockMultipartFile("file", "empty.pdf", "application/pdf", new byte[0]);

        assertThrows(IllegalArgumentException.class, () -> service.saveFile(file, ""));
    }

    @Test
    void loadFile_shouldRejectTraversalAndReturnNullForMissingFile() {
        LessonFileService service = new LessonFileService(uploadDir.toString());

        assertThrows(IllegalArgumentException.class, () -> service.loadFile("../secret.txt"));
        assertNull(service.loadFile("missing.pdf"));
    }

    @Test
    void loadFile_shouldReturnReadableResourceForSavedFile() {
        LessonFileService service = new LessonFileService(uploadDir.toString());
        MockMultipartFile file = new MockMultipartFile("file", "lesson.pdf", "application/pdf", "content".getBytes());
        String url = service.saveFile(file, "");
        String filename = url.substring(url.lastIndexOf('/') + 1);

        assertNotNull(service.loadFile(filename));
    }
}
