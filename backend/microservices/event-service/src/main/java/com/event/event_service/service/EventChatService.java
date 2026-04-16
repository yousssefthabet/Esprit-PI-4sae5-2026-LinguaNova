package com.event.event_service.service;

import com.event.event_service.entity.ChatMessage;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class EventChatService {

    private final Map<Long, List<ChatMessage>> messagesByEventId = new ConcurrentHashMap<>();

    public List<ChatMessage> getRecentMessages(Long eventId, int limit) {
        List<ChatMessage> all = messagesByEventId.getOrDefault(eventId, Collections.emptyList());
        if (all.isEmpty()) return Collections.emptyList();
        int from = Math.max(0, all.size() - Math.max(1, limit));
        return new ArrayList<>(all.subList(from, all.size()));
    }

    public ChatMessage addMessage(ChatMessage msg) {
        messagesByEventId.compute(msg.getEventId(), (eventId, list) -> {
            if (list == null) list = Collections.synchronizedList(new ArrayList<>());
            list.add(msg);
            return list;
        });
        return msg;
    }

    public ChatMessage addReaction(Long eventId, String messageId, String emoji) {
        List<ChatMessage> list = messagesByEventId.get(eventId);
        if (list == null) return null;
        synchronized (list) {
            for (ChatMessage m : list) {
                if (messageId.equals(m.getId())) {
                    m.getReactions().merge(emoji, 1, Integer::sum);
                    return m;
                }
            }
        }
        return null;
    }
}

