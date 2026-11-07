
package com.researchassistant.research_assistant_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.researchassistant.research_assistant_backend.dto.request.AIRequest;
import com.researchassistant.research_assistant_backend.dto.request.GeneratePaperRequest;
import com.researchassistant.research_assistant_backend.dto.response.AIResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AIService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String model;

    private static final Map<String, Integer> SECTION_TOKEN_LIMITS =
            Map.of(
                    "TITLE", 150,
                    "ABSTRACT", 700,
                    "KEYWORDS", 150,
                    "INTRODUCTION", 1200,
                    "LITERATURE_REVIEW", 1400,
                    "METHODOLOGY", 1000,
                    "CONCLUSION", 700
            );

    private static final String[] SECTION_ORDER = {
            "TITLE",
            "ABSTRACT",
            "KEYWORDS",
            "INTRODUCTION",
            "LITERATURE_REVIEW",
            "METHODOLOGY",
            "CONCLUSION"
    };

    public AIService(
            @Value("${groq.api-key}") String apiKey,
            @Value("${groq.model:openai/gpt-oss-20b}") String model,
            ObjectMapper objectMapper) {

        this.model = model;
        this.objectMapper = objectMapper;

        this.restClient = RestClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + apiKey
                )
                .defaultHeader(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    // Generate individual research paper section
    public AIResponse generateResearchDraft(AIRequest request) {

        String section = normalizeSection(request.getSection());

        String content = generateSection(
                request.getTopic(),
                section,
                request.getInstructions()
        );

        return new AIResponse(
                content,
                section.replace('_', ' ') + " generated successfully"
        );
    }

    // Generate complete research paper
    public Map<String, String> generateCompleteResearchPaper(
            GeneratePaperRequest request) {

        Map<String, String> sections = new LinkedHashMap<>();

        for (String section : SECTION_ORDER) {

            String content = generateSection(
                    request.getTopic(),
                    section,
                    request.getInstructions()
            );

            sections.put(section, content);
        }

        return sections;
    }

    // Generate content using Groq API
    private String generateSection(
            String topic,
            String section,
            String customInstructions) {

        Integer maxTokens = SECTION_TOKEN_LIMITS.get(section);

        if (maxTokens == null) {
            throw new IllegalArgumentException(
                    "Unsupported section: " + section
            );
        }

        String instructions =
                customInstructions == null
                        || customInstructions.isBlank()
                        ? "Write in clear, formal academic English."
                        : customInstructions.trim();

        // Strict academic accuracy instructions
        String extraInstruction = """
                STRICT ACADEMIC ACCURACY RULES:

                1. Never invent authors, research papers, journal names,
                   publication years, DOIs, URLs or references.

                2. Never create fake survey results, interview findings,
                   sample sizes, percentages, statistics or experimental
                   results.

                3. Never claim that research activities have been completed
                   unless the user has provided actual evidence or data.

                4. If verified research sources are not provided, clearly
                   write: [Verified academic source required].
                   Do not create example citations that look real.

                5. If research data is unavailable, clearly mention:
                   [Research data required].
                   Do not present assumptions as actual findings.

                6. For ABSTRACT and CONCLUSION, do not claim actual findings
                   when no research results have been supplied. Describe
                   the proposed study and its expected contribution instead.

                7. For METHODOLOGY, describe a proposed research method.
                   Do not invent participants, sample sizes, institutions,
                   ethical approvals or completed experiments.

                8. For LITERATURE REVIEW, discuss general concepts and themes
                   without inventing named studies or citations.

                9. Maintain formal academic language and logical structure.

                10. Accuracy is more important than making the paper appear
                    complete. Clearly identify missing information.

                11. Prefer normal ASCII hyphens (-) instead of special
                    dash characters such as en dash or em dash.
                """;

        String prompt = """
                Write only the %s section of an academic research paper.

                Research topic: %s

                Instructions: %s

                %s

                Write complete, relevant and useful academic content.

                Use appropriate academic headings and paragraphs.

                Do not write any other paper sections.

                Do not add fabricated references or research findings.
                """.formatted(
                section.replace('_', ' '),
                topic.trim(),
                instructions,
                extraInstruction
        );

        try {

            ObjectNode body = objectMapper.createObjectNode();

            body.put("model", model);
            body.put("max_completion_tokens", maxTokens);
            body.put("reasoning_effort", "low");

            ArrayNode messages = body.putArray("messages");

            ObjectNode systemMessage = messages.addObject();

            systemMessage.put("role", "system");

            systemMessage.put(
                    "content",
                    """
                    You are a responsible academic research writing assistant.

                    Your priority is academic accuracy, originality,
                    clarity and research integrity.

                    Never fabricate research data, citations, authors,
                    publications, statistics or experimental findings.

                    Clearly identify missing information using placeholders.

                    Use normal ASCII hyphens instead of special dash characters.

                    Return only the requested academic section.
                    """
            );

            ObjectNode userMessage = messages.addObject();

            userMessage.put("role", "user");
            userMessage.put("content", prompt);

            JsonNode response = restClient.post()
                    .uri("/chat/completions")
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);

            JsonNode choice = response == null
                    ? null
                    : response.path("choices").path(0);

            JsonNode content = choice == null
                    ? null
                    : choice.path("message").path("content");

            if (content == null
                    || content.isMissingNode()
                    || content.isNull()
                    || content.asText().isBlank()) {

                String reason = choice == null
                        ? "No choice returned by Groq"
                        : choice.path("finish_reason").asText("unknown");

                throw new RuntimeException(
                        "Groq returned empty content for "
                                + section
                                + ". Finish reason: "
                                + reason
                );
            }

            // Normalize special dash characters
            return normalizeGeneratedText(content.asText());

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Groq generation failed for "
                            + section
                            + ": "
                            + exception.getMessage(),
                    exception
            );
        }
    }

    // Replace special dash characters with normal hyphen
    private String normalizeGeneratedText(String content) {

        return content
                .replace('\u2013', '-')
                .replace('\u2014', '-')
                .replace('\u2011', '-');
    }

    // Normalize section names
    private String normalizeSection(String section) {

        if (section == null || section.isBlank()) {
            throw new IllegalArgumentException(
                    "Section cannot be empty"
            );
        }

        return section.trim()
                .toUpperCase()
                .replace(' ', '_')
                .replace('-', '_');
    }
}
