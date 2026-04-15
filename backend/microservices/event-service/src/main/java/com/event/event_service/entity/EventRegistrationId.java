package com.event.event_service.entity;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationId implements Serializable {
    private Long eventId;
    private Long studentId;
}

