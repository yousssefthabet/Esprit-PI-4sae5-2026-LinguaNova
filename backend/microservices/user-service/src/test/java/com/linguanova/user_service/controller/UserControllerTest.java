package com.linguanova.user_service.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.linguanova.user_service.dto.CurrentUserResponse;
import com.linguanova.user_service.entity.Role;
import com.linguanova.user_service.entity.User;
import com.linguanova.user_service.repository.UserRepository;
import com.linguanova.user_service.service.AuthService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private UserController userController;

    @Test
    void getUserById_shouldReturnMappedUser() {
        User user = User.builder().id(1L).email("teacher@example.com").role(Role.TEACHER).build();
        CurrentUserResponse mapped = CurrentUserResponse.builder()
                .id(1L)
                .email("teacher@example.com")
                .role("TEACHER")
                .build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(authService.toCurrentUserResponsePublic(user)).thenReturn(mapped);

        ResponseEntity<CurrentUserResponse> response = userController.getUserById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mapped, response.getBody());
    }

    @Test
    void getUserById_shouldReturnNotFoundWhenMissing() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<CurrentUserResponse> response = userController.getUserById(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void getAllUsers_shouldMapEveryUser() {
        User student = User.builder().id(1L).email("student@example.com").role(Role.STUDENT).build();
        User teacher = User.builder().id(2L).email("teacher@example.com").role(Role.TEACHER).build();
        when(userRepository.findAll()).thenReturn(List.of(student, teacher));
        when(authService.toCurrentUserResponsePublic(student)).thenReturn(CurrentUserResponse.builder().id(1L).build());
        when(authService.toCurrentUserResponsePublic(teacher)).thenReturn(CurrentUserResponse.builder().id(2L).build());

        ResponseEntity<List<CurrentUserResponse>> response = userController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(authService).toCurrentUserResponsePublic(student);
        verify(authService).toCurrentUserResponsePublic(teacher);
    }
}
