package com.linguanova.user_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-hours:1}") long expirationHours) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters for HS256");
        }
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationHours * 60 * 60 * 1000;
    }

    public String generateToken(String email, String role) {
        return generateToken(email, role, null);
    }

    /** Generate JWT with optional display name (e.g. for teacher). Puts "role", "roles" (list), and "name" for course-service. */
    public String generateToken(String email, String role, String name) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        var builder = Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("roles", java.util.List.of(role))
                .setIssuedAt(now)
                .setExpiration(expiry);
        if (name != null && !name.isBlank()) {
            builder.claim("name", name.trim());
        }
        return builder.signWith(secretKey).compact();
    }

    public String extractEmail(String token) {
        Claims payload = parseToken(token);
        return payload != null ? payload.getSubject() : null;
    }

    public String extractRole(String token) {
        Claims payload = parseToken(token);
        if (payload == null) return null;
        Object role = payload.get("role");
        return role != null ? role.toString() : null;
    }

    /** Extract display name claim (e.g. for teacher). Returns null if not present. */
    public String extractName(String token) {
        Claims payload = parseToken(token);
        if (payload == null) return null;
        Object name = payload.get("name");
        return name != null ? name.toString().trim() : null;
    }

    public boolean validateToken(String token, String email) {
        String subject = extractEmail(token);
        return subject != null && subject.equals(email);
    }

    private Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            return null;
        }
    }
}
