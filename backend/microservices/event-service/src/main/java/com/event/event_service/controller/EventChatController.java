package com.event.event_service.controller;

import com.event.event_service.entity.ChatMessage;
import com.event.event_service.entity.ChatReaction;
import com.event.event_service.entity.EventRegistration;
import com.event.event_service.repository.EventRegistrationRepository;
import com.event.event_service.service.EventChatService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventChatController {

    private final EventChatService chatService;
    private final EventRegistrationRepository registrationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{eventId}/chat")
    public List<ChatMessage> getRecent(@PathVariable Long eventId) {
        return chatService.getRecentMessages(eventId, 50);
    }

    @MessageMapping("/events/{eventId}/chat.send")
    public void send(@DestinationVariable Long eventId, @Payload Map<String, Object> payload) {
        Long studentId = payload.get("student_id") instanceof Number n ? n.longValue() : null;
        String senderName = payload.get("sender_name") instanceof String s ? s : null;
        String text = payload.get("text") instanceof String s ? s : null;

        if (studentId == null || text == null || text.trim().isEmpty()) {
            return;
        }
        if (!registrationRepository.existsByEventIdAndStudentId(eventId, studentId)) {
            return;
        }

        ChatMessage msg = chatService.addMessage(ChatMessage.newMessage(
                eventId,
                studentId,
                (senderName == null || senderName.isBlank()) ? ("Student#" + studentId) : senderName,
                text.trim()
        ));
        messagingTemplate.convertAndSend("/topic/events/" + eventId + "/chat", msg);
    }

    @MessageMapping("/events/{eventId}/chat.react")
    public void react(@DestinationVariable Long eventId, @Payload ChatReaction reaction) {
        if (reaction == null) return;
        String messageId = reaction.getMessageId();
        String emoji = reaction.getEmoji();
        if (messageId == null || messageId.isBlank() || emoji == null || emoji.isBlank()) return;

        ChatMessage updated = chatService.addReaction(eventId, messageId, emoji);
        if (updated != null) {
            messagingTemplate.convertAndSend("/topic/events/" + eventId + "/chat.reactions", updated);
        }
    }
}

