package com.event.event_service.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.event.event_service.service.accessibility.MockTextSimplificationService;
import org.junit.jupiter.api.Test;

class MockTextSimplificationServiceTest {

    private final MockTextSimplificationService service = new MockTextSimplificationService();

    @Test
    void simplify_shouldReplaceComplexVocabulary() {
        String input = "We should utilize numerous examples to facilitate comprehension.";

        String output = service.simplify(input);

        assertTrue(output.toLowerCase().contains("use"));
        assertTrue(output.toLowerCase().contains("many"));
        assertTrue(output.toLowerCase().contains("help"));
        assertFalse(output.toLowerCase().contains("utilize"));
    }

    @Test
    void simplify_shouldReturnNonEmptyTextWhenInputExists() {
        String output = service.simplify("This sentence is already simple.");

        assertFalse(output.isBlank());
    }
}
