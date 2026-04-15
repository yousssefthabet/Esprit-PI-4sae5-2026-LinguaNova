package com.linguanova.courss_service.course.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LessonFileService {

    private final Path uploadRoot;

    public LessonFileService(@Value("${app.lesson-files.upload-dir:lesson-files}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadRoot, e);
        }
    }

    /**
     * Save an uploaded lesson file (PDF/video) and return the public path to access it.
     * Returns a path like "/PIproject/api/courses/files/{uniqueId}-{sanitizedFileName}".
     */
    public String saveFile(MultipartFile file, String contextPath) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            originalName = "file";
        }
        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        if (safeName.length() > 100) {
            safeName = safeName.substring(0, 100);
        }
        String storedName = UUID.randomUUID().toString() + "-" + safeName;
        Path target = uploadRoot.resolve(storedName);
        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
        String base = (contextPath != null && !contextPath.isBlank()) ? contextPath : "";
        return base + "/api/courses/files/" + storedName;
    }

    public Resource loadFile(String filename) {
        if (filename == null || filename.isBlank() || filename.contains("..")) {
            throw new IllegalArgumentException("Invalid filename");
        }
        Path file = uploadRoot.resolve(filename).normalize();
        if (!file.startsWith(uploadRoot)) {
            throw new IllegalArgumentException("Invalid filename");
        }
        try {
            Resource r = new UrlResource(file.toUri());
            if (r.exists() && r.isReadable()) return r;
        } catch (MalformedURLException e) {
            // ignore
        }
        return null;
    }
}
