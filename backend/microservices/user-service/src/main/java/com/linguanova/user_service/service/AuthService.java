package com.linguanova.user_service.service;

import com.linguanova.user_service.dto.*;
import com.linguanova.user_service.entity.Role;
import com.linguanova.user_service.entity.User;
import com.linguanova.user_service.repository.UserRepository;
import com.linguanova.user_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse registerStudent(RegisterStudentRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        String email = request.getEmail() != null ? request.getEmail().trim() : null;
        String username = request.getUsername() != null ? request.getUsername().trim() : null;
        String password = request.getPassword();
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(Role.STUDENT)
                .createdAt(now)
                .updatedAt(now)
                .build();
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public AuthResponse registerTeacher(RegisterTeacherRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .email(request.getEmail().trim())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .dateOfBirth(request.getDateOfBirth())
                .teachingExperience(request.getTeachingExperience())
                .highestEducation(request.getHighestEducation())
                .certificationNumber(request.getCertificationNumber())
                .subjectSpecializations(request.getSubjectSpecializations())
                .gradeLevelsTaught(request.getGradeLevelsTaught())
                .profilePhoto(request.getProfilePhoto())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.TEACHER)
                .createdAt(now)
                .updatedAt(now)
                .build();
        user = userRepository.save(user);
        String teacherName = (request.getFirstName() != null ? request.getFirstName().trim() : "") + " " + (request.getLastName() != null ? request.getLastName().trim() : "");
        if (teacherName.trim().isEmpty()) teacherName = request.getEmail();
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), teacherName.trim());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String name = null;
        if (user.getRole() == Role.TEACHER) {
            if (user.getFirstName() != null || user.getLastName() != null) {
                name = (user.getFirstName() != null ? user.getFirstName().trim() : "") + " " + (user.getLastName() != null ? user.getLastName().trim() : "");
                if (name.trim().isEmpty()) name = user.getEmail();
            } else {
                int at = user.getEmail().indexOf('@');
                name = at > 0 ? user.getEmail().substring(0, at) : user.getEmail();
            }
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), name);
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .build();
    }

    /**
     * Get current user profile by email (from JWT). Used by GET /api/auth/me.
     */
    @Transactional(readOnly = true)
    public Optional<CurrentUserResponse> getCurrentUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::toCurrentUserResponse);
    }

    private CurrentUserResponse toCurrentUserResponse(User u) {
        return toCurrentUserResponsePublic(u);
    }

    public CurrentUserResponse toCurrentUserResponsePublic(User u) {
        List<String> subjects = splitComma(u.getSubjectSpecializations());
        List<String> grades = splitComma(u.getGradeLevelsTaught());
        Integer expYears = null;
        if (u.getTeachingExperience() != null && !u.getTeachingExperience().trim().isEmpty()) {
            try {
                expYears = Integer.parseInt(u.getTeachingExperience().trim());
            } catch (NumberFormatException ignored) { }
        }
        return CurrentUserResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .role(u.getRole().name())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .username(u.getUsername())
                .phoneNumber(u.getPhoneNumber())
                .dateOfBirth(u.getDateOfBirth())
                .teachingExperience(expYears)
                .highestEducation(u.getHighestEducation())
                .certificationNumber(u.getCertificationNumber())
                .subjectSpecializations(subjects)
                .gradeLevels(grades)
                .profilePhoto(u.getProfilePhoto())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }

    private static List<String> splitComma(String s) {
        if (s == null || s.trim().isEmpty()) return new ArrayList<>();
        return Arrays.stream(s.split(","))
                .map(String::trim)
                .filter(x -> !x.isEmpty())
                .collect(Collectors.toList());
    }
}
