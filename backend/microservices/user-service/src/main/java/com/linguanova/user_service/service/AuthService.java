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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse registerStudent(RegisterStudentRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
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
        User user = User.builder()
                .email(request.getEmail())
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
                .build();
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
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
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .build();
    }
}
