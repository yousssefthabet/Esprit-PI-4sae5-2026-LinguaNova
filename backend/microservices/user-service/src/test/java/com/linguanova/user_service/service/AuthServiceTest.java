package com.linguanova.user_service.service;

import com.linguanova.user_service.dto.AuthResponse;
import com.linguanova.user_service.dto.CurrentUserResponse;
import com.linguanova.user_service.dto.LoginRequest;
import com.linguanova.user_service.dto.RegisterStudentRequest;
import com.linguanova.user_service.dto.RegisterTeacherRequest;
import com.linguanova.user_service.entity.Role;
import com.linguanova.user_service.entity.User;
import com.linguanova.user_service.repository.UserRepository;
import com.linguanova.user_service.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerStudent_shouldTrimEmailEncodePasswordAndReturnToken() {
        RegisterStudentRequest request = RegisterStudentRequest.builder()
                .email(" student@example.com ")
                .username(" student-one ")
                .password("secret123")
                .build();

        when(userRepository.existsByEmail("student@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken("student@example.com", "STUDENT")).thenReturn("student-token");

        AuthResponse response = authService.registerStudent(request);

        assertEquals("student-token", response.getToken());
        assertEquals("STUDENT", response.getRole());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals("student@example.com", savedUser.getEmail());
        assertEquals("student-one", savedUser.getUsername());
        assertEquals("encoded", savedUser.getPassword());
        assertEquals(Role.STUDENT, savedUser.getRole());
    }

    @Test
    void registerStudent_shouldRejectDuplicateEmail() {
        RegisterStudentRequest request = RegisterStudentRequest.builder()
                .email("student@example.com")
                .username("student")
                .password("secret123")
                .build();
        when(userRepository.existsByEmail("student@example.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.registerStudent(request));

        assertEquals("Email already registered", ex.getMessage());
    }

    @Test
    void registerTeacher_shouldSaveTeacherProfileAndGenerateNamedToken() {
        RegisterTeacherRequest request = new RegisterTeacherRequest(
                " teacher@example.com ",
                "Amina",
                "Ben Ali",
                "22111222",
                LocalDate.of(1990, 1, 12),
                "5",
                "Master",
                "CERT-42",
                "English, French",
                "K-12, College",
                "photo.png",
                "secret123"
        );

        when(userRepository.existsByEmail(" teacher@example.com ")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken("teacher@example.com", "TEACHER", "Amina Ben Ali")).thenReturn("teacher-token");

        AuthResponse response = authService.registerTeacher(request);

        assertEquals("teacher-token", response.getToken());
        assertEquals("TEACHER", response.getRole());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals("teacher@example.com", savedUser.getEmail());
        assertEquals("Amina", savedUser.getFirstName());
        assertEquals("Ben Ali", savedUser.getLastName());
        assertEquals(Role.TEACHER, savedUser.getRole());
    }

    @Test
    void login_shouldRejectBadPassword() {
        User user = User.builder()
                .email("student@example.com")
                .password("encoded")
                .role(Role.STUDENT)
                .build();
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.login(LoginRequest.builder().email("student@example.com").password("wrong").build()));

        assertEquals("Invalid email or password", ex.getMessage());
    }

    @Test
    void login_shouldGenerateTeacherTokenWithDisplayName() {
        User user = User.builder()
                .email("teacher@example.com")
                .password("encoded")
                .role(Role.TEACHER)
                .firstName("Amina")
                .lastName("Ben Ali")
                .build();
        when(userRepository.findByEmail("teacher@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "encoded")).thenReturn(true);
        when(jwtService.generateToken("teacher@example.com", "TEACHER", "Amina Ben Ali")).thenReturn("teacher-token");

        AuthResponse response = authService.login(LoginRequest.builder()
                .email("teacher@example.com")
                .password("secret123")
                .build());

        assertEquals("teacher-token", response.getToken());
        assertEquals("TEACHER", response.getRole());
        verify(jwtService).generateToken(eq("teacher@example.com"), eq("TEACHER"), eq("Amina Ben Ali"));
    }

    @Test
    void getCurrentUserByEmail_shouldMapTeacherListsAndExperience() {
        User teacher = User.builder()
                .id(7L)
                .email("teacher@example.com")
                .role(Role.TEACHER)
                .firstName("Amina")
                .lastName("Ben Ali")
                .teachingExperience("6")
                .subjectSpecializations("English, French, ")
                .gradeLevelsTaught("K-12, Adult Ed")
                .build();
        when(userRepository.findByEmail("teacher@example.com")).thenReturn(Optional.of(teacher));

        Optional<CurrentUserResponse> result = authService.getCurrentUserByEmail("teacher@example.com");

        assertTrue(result.isPresent());
        assertEquals("TEACHER", result.get().getRole());
        assertEquals(6, result.get().getTeachingExperience());
        assertEquals(2, result.get().getSubjectSpecializations().size());
        assertEquals(2, result.get().getGradeLevels().size());
    }

    @Test
    void getCurrentUserByEmail_shouldReturnEmptyWhenMissing() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertFalse(authService.getCurrentUserByEmail("missing@example.com").isPresent());
    }
}
