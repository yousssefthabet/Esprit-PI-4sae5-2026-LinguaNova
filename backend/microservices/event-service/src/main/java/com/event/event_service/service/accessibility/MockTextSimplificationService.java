package com.event.event_service.service.accessibility;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class MockTextSimplificationService implements TextSimplificationService {

    private static final Map<String, String> WORD_REPLACEMENTS = buildWordReplacements();
    private static final int MAX_SENTENCES = 4;
    private static final int MAX_SENTENCE_LENGTH = 120;

    @Override
    public String simplify(String text) {
        String normalized = normalize(text);
        if (normalized.isBlank()) {
            return "";
        }

        String easierVocabulary = applyWordReplacements(normalized);
        String[] baseSentences = easierVocabulary.split("(?<=[.!?])\\s+");
        List<String> simplifiedSentences = new ArrayList<>();

        for (String sentence : baseSentences) {
            if (sentence.isBlank()) {
                continue;
            }
            addSimplifiedSentence(simplifiedSentences, sentence.trim());
            if (simplifiedSentences.size() >= MAX_SENTENCES) {
                break;
            }
        }

        if (simplifiedSentences.isEmpty()) {
            return ensureSentenceEnding(easierVocabulary);
        }
        return String.join(" ", simplifiedSentences);
    }

    private void addSimplifiedSentence(List<String> target, String sentence) {
        if (sentence.length() <= MAX_SENTENCE_LENGTH) {
            target.add(ensureSentenceEnding(capitalize(sentence)));
            return;
        }

        String[] clauses = sentence.split("\\s*(?:,|;|\\band\\b|\\bbut\\b|\\bwhich\\b)\\s*");
        for (String clause : clauses) {
            String cleaned = clause.trim();
            if (cleaned.isBlank()) {
                continue;
            }
            target.add(ensureSentenceEnding(capitalize(cleaned)));
            if (target.size() >= MAX_SENTENCES) {
                return;
            }
        }
    }

    private String applyWordReplacements(String text) {
        String result = text;
        for (Map.Entry<String, String> entry : WORD_REPLACEMENTS.entrySet()) {
            result = result.replaceAll("(?i)\\b" + entry.getKey() + "\\b", entry.getValue());
        }
        return result;
    }

    private String normalize(String text) {
        return text == null ? "" : text.trim().replaceAll("\\s+", " ");
    }

    private String ensureSentenceEnding(String sentence) {
        if (sentence.endsWith(".") || sentence.endsWith("!") || sentence.endsWith("?")) {
            return sentence;
        }
        return sentence + ".";
    }

    private String capitalize(String value) {
        if (value.isBlank()) {
            return value;
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }

    private static Map<String, String> buildWordReplacements() {
        Map<String, String> replacements = new LinkedHashMap<>();
        replacements.put("approximately", "about");
        replacements.put("individuals", "people");
        replacements.put("numerous", "many");
        replacements.put("facilitate", "help");
        replacements.put("utilize", "use");
        replacements.put("demonstrate", "show");
        replacements.put("assistance", "help");
        replacements.put("objective", "goal");
        replacements.put("commence", "start");
        replacements.put("terminate", "end");
        replacements.put("purchase", "buy");
        replacements.put("reside", "live");
        replacements.put("comprehend", "understand");
        replacements.put("requirements", "needs");
        return replacements;
    }
}

