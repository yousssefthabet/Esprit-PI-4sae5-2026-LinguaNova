package com.linguanova.user_service.controller;

import com.linguanova.user_service.dto.CurrentUserResponse;
import com.linguanova.user_service.entity.User;
import com.linguanova.user_service.repository.UserRepository;
import com.linguanova.user_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    /**
     * Récupérer un utilisateur par son ID (utilisé par les autres microservices via Feign).
     */
    @GetMapping("/{id}")
    public ResponseEntity<CurrentUserResponse> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(authService::toCurrentUserResponsePublic)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupérer tous les utilisateurs (utile pour les admins / services internes).
     */
    @GetMapping
    public ResponseEntity<List<CurrentUserResponse>> getAllUsers() {
        List<CurrentUserResponse> users = userRepository.findAll()
                .stream()
                .map(authService::toCurrentUserResponsePublic)
                .toList();
        return ResponseEntity.ok(users);
    }
}

