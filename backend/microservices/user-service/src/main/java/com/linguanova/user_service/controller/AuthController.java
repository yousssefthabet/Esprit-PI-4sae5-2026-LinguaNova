package com.linguanova.user_service.controller;

import com.linguanova.user_service.dto.*;
import com.linguanova.user_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final com.linguanova.user_service.security.JwtService jwtService;

    @PostMapping("/register/student")
    public ResponseEntity<AuthResponse> registerStudent(@Valid @RequestBody RegisterStudentRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/teacher")
    public ResponseEntity<AuthResponse> registerTeacher(@Valid @RequestBody RegisterTeacherRequest request) {
        AuthResponse response = authService.registerTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(Authentication authentication, HttpServletRequest request) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getPrincipal().toString();
        Optional<CurrentUserResponse> userOpt = authService.getCurrentUserByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        CurrentUserResponse user = userOpt.get();
        // If DB has no first/last name but JWT has "name" (e.g. teacher), use it
        boolean noName = (user.getFirstName() == null || user.getFirstName().isBlank())
                && (user.getLastName() == null || user.getLastName().isBlank());
        if (noName) {
            String bearer = request.getHeader("Authorization");
            if (bearer != null && bearer.startsWith("Bearer ")) {
                String name = jwtService.extractName(bearer.substring(7));
                if (name != null && !name.isBlank()) {
                    String[] parts = name.trim().split("\\s+", 2);
                    user = CurrentUserResponse.builder()
                            .id(user.getId())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .firstName(parts[0])
                            .lastName(parts.length > 1 ? parts[1] : "")
                            .username(user.getUsername())
                            .phoneNumber(user.getPhoneNumber())
                            .dateOfBirth(user.getDateOfBirth())
                            .teachingExperience(user.getTeachingExperience())
                            .highestEducation(user.getHighestEducation())
                            .certificationNumber(user.getCertificationNumber())
                            .subjectSpecializations(user.getSubjectSpecializations())
                            .gradeLevels(user.getGradeLevels())
                            .profilePhoto(user.getProfilePhoto())
                            .createdAt(user.getCreatedAt())
                            .updatedAt(user.getUpdatedAt())
                            .build();
                }
            }
        }
        return ResponseEntity.ok(user);
    }
}
