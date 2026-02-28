package com.linguanova.courss_service.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ") && jwtSecret != null && !jwtSecret.isBlank()) {
            String token = authHeader.substring(7);
            try {
                SecretKey key = io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
                Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

                String subject = claims.getSubject();
                @SuppressWarnings("unchecked")
                List<String> roles = claims.get("roles", List.class);
                List<SimpleGrantedAuthority> authorities;
                if (roles != null && !roles.isEmpty()) {
                    authorities = roles.stream()
                        .map(r -> new SimpleGrantedAuthority(r.startsWith("ROLE_") ? r : "ROLE_" + r))
                        .collect(Collectors.toList());
                } else {
                    // user-service sends "role" (singular string), e.g. "TEACHER" or "STUDENT"
                    Object role = claims.get("role");
                    String roleStr = role != null ? role.toString() : null;
                    authorities = roleStr != null && !roleStr.isBlank()
                        ? List.of(new SimpleGrantedAuthority(roleStr.startsWith("ROLE_") ? roleStr : "ROLE_" + roleStr))
                        : List.of();
                }

                var auth = new UsernamePasswordAuthenticationToken(subject, null, authorities);
                auth.setDetails(claims); // so controllers can read "name" etc.
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception ignored) {
                // Invalid or expired token – leave context empty
            }
        }

        filterChain.doFilter(request, response);
    }
}
