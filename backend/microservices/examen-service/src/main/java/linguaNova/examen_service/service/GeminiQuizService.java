package linguaNova.examen_service.service;

import linguaNova.examen_service.dto.ExamGenerateRequest;
import linguaNova.examen_service.dto.GeneratedQuestionDto;
import linguaNova.examen_service.dto.GeneratedQuizResponse;
import linguaNova.examen_service.dto.QuizGenerateRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiQuizService {

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key:}")
    private String apiKey;

    public GeneratedQuizResponse generateQuiz(QuizGenerateRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Gemini API key is not configured. Set gemini.api.key in application.properties.");
        }

        String prompt = buildPrompt(request);
        String jsonText = callGemini(prompt);
        return parseQuizResponse(jsonText, request.getTopic());
    }

    public GeneratedQuizResponse generateExamQuestions(ExamGenerateRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Gemini API key is not configured. Set gemini.api.key in application.properties.");
        }
        String prompt = buildExamPrompt(request);
        String jsonText = callGemini(prompt);
        return parseQuizResponse(jsonText, request.getTitle());
    }

    private String buildExamPrompt(ExamGenerateRequest req) {
        return """
                You are an English exam question generator for a teacher.
                Generate exam questions as a single valid JSON object with this exact structure (no markdown, no code fence, no extra text):
                {"title":"Exam title here","questions":[{"content":"Question text?","type":"QCM","options":["Option A","Option B","Option C","Option D"],"correctIndex":0}]}
                Rules:
                - Exam title: %s
                - Exam description: %s
                - Course name: %s
                - difficulty: %s
                - number of questions: %d
                - type must be either "QCM" (4 options) or "TRUE_FALSE" (options: ["True","False"], correctIndex 0 or 1)
                - Generate questions directly relevant to the exam topic and description
                - All question text and options in English
                - correctIndex is 0-based index of the correct option
                Return only the JSON object, nothing else.
                """
                .formatted(
                        req.getTitle(),
                        req.getDescription(),
                        req.getCourseName(),
                        req.getDifficulty(),
                        req.getNumQuestions());
    }

    private String buildPrompt(QuizGenerateRequest request) {
        return """
                You are an English quiz generator. Generate a quiz as a single valid JSON object with this exact structure (no markdown, no code fence, no extra text):
                {"title":"Quiz title here","questions":[{"content":"Question text?","type":"QCM","options":["Option A","Option B","Option C","Option D"],"correctIndex":0}]}
                Rules:
                - topic: %s
                - difficulty: %s
                - number of questions: %d
                - type must be either "QCM" (4 options) or "TRUE_FALSE" (options: ["True","False"], correctIndex 0 or 1)
                - All question text and options in English
                - correctIndex is 0-based index of the correct option
                Return only the JSON object, nothing else.
                """
                .formatted(
                        request.getTopic(),
                        request.getDifficulty(),
                        request.getNumQuestions());
    }

    @SuppressWarnings("unchecked")
    private String callGemini(String prompt) {
        String url = GEMINI_URL + "?key=" + apiKey;
        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.3,
                        "maxOutputTokens", 8192,
                        "responseMimeType", "application/json"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
        Map res = response.getBody();
        if (res == null)
            throw new RuntimeException("Empty response from Gemini");
        List<?> candidates = (List<?>) res.get("candidates");
        if (candidates == null || candidates.isEmpty())
            throw new RuntimeException("No candidates in Gemini response");
        Map<String, Object> candidate = (Map<String, Object>) candidates.get(0);
        Map<String, Object> content = (Map<String, Object>) candidate.get("content");
        if (content == null)
            throw new RuntimeException("No content in Gemini response");
        List<?> parts = (List<?>) content.get("parts");
        if (parts == null || parts.isEmpty())
            throw new RuntimeException("No parts in Gemini response");
        Map<String, Object> part = (Map<String, Object>) parts.get(0);
        Object text = part.get("text");
        if (text == null)
            throw new RuntimeException("No text in Gemini response");
        String raw = text.toString().trim();
        if (raw.startsWith("```")) {
            int start = raw.indexOf("{");
            int end = raw.lastIndexOf("}");
            if (start >= 0 && end > start)
                raw = raw.substring(start, end + 1);
        }
        return raw;
    }

    private GeneratedQuizResponse parseQuizResponse(String jsonText, String fallbackTitle) {
        try {
            JsonNode root = objectMapper.readTree(jsonText);
            String title = root.has("title") ? root.get("title").asText() : ("Quiz: " + fallbackTitle);
            List<GeneratedQuestionDto> questions = new ArrayList<>();
            JsonNode qArray = root.get("questions");
            if (qArray != null && qArray.isArray()) {
                for (JsonNode q : qArray) {
                    GeneratedQuestionDto dto = new GeneratedQuestionDto();
                    dto.setContent(q.has("content") ? q.get("content").asText() : "");
                    dto.setType(q.has("type") ? q.get("type").asText() : "QCM");
                    List<String> options = new ArrayList<>();
                    if (q.has("options") && q.get("options").isArray()) {
                        for (JsonNode opt : q.get("options"))
                            options.add(opt.asText());
                    }
                    dto.setOptions(options);
                    dto.setCorrectIndex(q.has("correctIndex") ? q.get("correctIndex").asInt() : 0);
                    questions.add(dto);
                }
            }
            return new GeneratedQuizResponse(title, questions);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini quiz JSON: " + e.getMessage(), e);
        }
    }
}
