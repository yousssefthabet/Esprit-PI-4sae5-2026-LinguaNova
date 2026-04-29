package com.linguanova.user_service.config;

import com.linguanova.user_service.entity.Role;
import com.linguanova.user_service.entity.User;
import com.linguanova.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminAccountInitializer {

    private static final String DEFAULT_ADMIN_EMAIL = "admin@linguanova.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "admin123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner createDefaultAdminAccount() {
        return args -> {
            if (userRepository.existsByEmail(DEFAULT_ADMIN_EMAIL)) {
                return;
            }

            User admin = User.builder()
                    .email(DEFAULT_ADMIN_EMAIL)
                    .password(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                    .role(Role.ADMIN)
                    .firstName("Platform")
                    .lastName("Admin")
                    .build();

            userRepository.save(admin);
        };
    }
}
