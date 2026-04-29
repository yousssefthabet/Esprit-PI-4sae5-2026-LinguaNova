package com.linguanova.user_service.controller;

import com.linguanova.user_service.dto.AuthResponse;
import com.linguanova.user_service.dto.CurrentUserResponse;
import com.linguanova.user_service.dto.LoginRequest;
import com.linguanova.user_service.dto.RegisterStudentRequest;
import com.linguanova.user_service.dto.RegisterTeacherRequest;
import com.linguanova.user_service.security.JwtService;
import com.linguanova.user_service.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.TestingAuthenticationToken;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private AuthController authController;

    @Test
    void registerStudent_shouldReturnCreated() {
        RegisterStudentRequest payload = RegisterStudentRequest.builder()
                .email("student@example.com")
                .username("student")
                .password("secret123")
                .build();
        when(authService.registerStudent(payload)).thenReturn(AuthResponse.builder().token("token").role("STUDENT").build());

        ResponseEntity<AuthResponse> response = authController.registerStudent(payload);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("STUDENT", response.getBody().getRole());
    }

    @Test
    void registerTeacher_shouldReturnCreated() {
        RegisterTeacherRequest payload = new RegisterTeacherRequest();
        payload.setEmail("teacher@example.com");
        when(authService.registerTeacher(payload)).thenReturn(AuthResponse.builder().token("token").role("TEACHER").build());

        ResponseEntity<AuthResponse> response = authController.registerTeacher(payload);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("TEACHER", response.getBody().getRole());
    }

    @Test
    void login_shouldReturnOk() {
        LoginRequest payload = LoginRequest.builder().email("admin@example.com").password("secret123").build();
        when(authService.login(payload)).thenReturn(AuthResponse.builder().token("token").role("ADMIN").build());

        ResponseEntity<AuthResponse> response = authController.login(payload);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("ADMIN", response.getBody().getRole());
    }

    @Test
    void getCurrentUser_shouldReturnUnauthorizedWithoutAuthentication() {
        ResponseEntity<CurrentUserResponse> response = authController.getCurrentUser(null, request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void getCurrentUser_shouldReturnNotFoundWhenEmailIsMissing() {
        TestingAuthenticationToken auth = new TestingAuthenticationToken("missing@example.com", null);
        when(authService.getCurrentUserByEmail("missing@example.com")).thenReturn(Optional.empty());

        ResponseEntity<CurrentUserResponse> response = authController.getCurrentUser(auth, request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getCurrentUser_shouldUseNameFromJwtWhenProfileNameIsEmpty() {
        TestingAuthenticationToken auth = new TestingAuthenticationToken("teacher@example.com", null);
        CurrentUserResponse profile = CurrentUserResponse.builder()
                .id(4L)
                .email("teacher@example.com")
                .role("TEACHER")
                .firstName("")
                .lastName("")
                .build();
        when(authService.getCurrentUserByEmail("teacher@example.com")).thenReturn(Optional.of(profile));
        when(request.getHeader("Authorization")).thenReturn("Bearer jwt-token");
        when(jwtService.extractName("jwt-token")).thenReturn("Amina Ben Ali");

        ResponseEntity<CurrentUserResponse> response = authController.getCurrentUser(auth, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Amina", response.getBody().getFirstName());
        assertEquals("Ben Ali", response.getBody().getLastName());
    }
}
