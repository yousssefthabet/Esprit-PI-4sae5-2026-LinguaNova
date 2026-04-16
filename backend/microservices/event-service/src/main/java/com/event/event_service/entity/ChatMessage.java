package com.event.event_service.entity;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    private String id;
    private Long eventId;
    private Long studentId;
    private String senderName;
    private String text;
    private Instant createdAt;

    @Builder.Default
    private Map<String, Integer> reactions = new HashMap<>();

    public static ChatMessage newMessage(Long eventId, Long studentId, String senderName, String text) {
        return ChatMessage.builder()
                .id(UUID.randomUUID().toString())
                .eventId(eventId)
                .studentId(studentId)
                .senderName(senderName)
                .text(text)
                .createdAt(Instant.now())
                .build();
    }
}

