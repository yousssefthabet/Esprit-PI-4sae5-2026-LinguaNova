package com.event.event_service.service.accessibility;

import com.event.event_service.entity.AccessibilityActionHistory;
import com.event.event_service.entity.AccessibilityActionType;
import com.event.event_service.repository.AccessibilityActionHistoryRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccessibilityHistoryService {

    private static final int MAX_PAYLOAD_LENGTH = 4000;
    private static final String DEFAULT_USER = "anonymous";

    private final AccessibilityActionHistoryRepository historyRepository;

    @Transactional
    public void record(String userId, AccessibilityActionType actionType, String inputPayload, String outputPayload) {
        AccessibilityActionHistory history = AccessibilityActionHistory.builder()
                .userId(resolveUserId(userId))
                .actionType(actionType)
                .inputPayload(truncate(inputPayload))
                .outputPayload(truncate(outputPayload))
                .createdAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);
    }

    private String resolveUserId(String userId) {
        String trimmed = userId == null ? "" : userId.trim();
        return trimmed.isBlank() ? DEFAULT_USER : trimmed;
    }

    private String truncate(String value) {
        if (value == null) {
            return "";
        }
        return value.length() <= MAX_PAYLOAD_LENGTH ? value : value.substring(0, MAX_PAYLOAD_LENGTH);
    }
}

