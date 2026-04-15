package com.event.event_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatReaction {
    private Long eventId;
    private String messageId;
    private String emoji;
}

