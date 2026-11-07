
package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.dto.request.AIRequest;
import com.researchassistant.research_assistant_backend.dto.request.GeneratePaperRequest;
import com.researchassistant.research_assistant_backend.dto.request.DraftRequest;
import com.researchassistant.research_assistant_backend.dto.response.AIResponse;
import com.researchassistant.research_assistant_backend.dto.response.DraftResponse;
import com.researchassistant.research_assistant_backend.dto.response.GeneratePaperResponse;
import com.researchassistant.research_assistant_backend.service.AIService;
import com.researchassistant.research_assistant_backend.service.DraftService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;
    private final DraftService draftService;

    public AIController(
            AIService aiService,
            DraftService draftService) {

        this.aiService = aiService;
        this.draftService = draftService;
    }

    // Generate individual research paper section
    @PostMapping("/generate")
    public AIResponse generateResearchDraft(
            @Valid @RequestBody AIRequest request) {

        return aiService.generateResearchDraft(request);
    }

    // Generate complete research paper and save automatically
    @PostMapping("/generate-paper")
    public GeneratePaperResponse generateCompletePaper(
            @Valid @RequestBody GeneratePaperRequest request) {

        Map<String, String> sections =
                aiService.generateCompleteResearchPaper(request);

        List<String> sectionOrder = List.of(
                "TITLE",
                "ABSTRACT",
                "KEYWORDS",
                "INTRODUCTION",
                "LITERATURE_REVIEW",
                "METHODOLOGY",
                "CONCLUSION"
        );

        // Clean title before creating complete paper
        String generatedTitle =
                cleanGeneratedTitle(sections.get("TITLE"));

        StringBuilder completeContent = new StringBuilder();

        for (String section : sectionOrder) {

            String content = sections.get(section);

            if (content == null || content.isBlank()) {
                throw new RuntimeException(
                        "Generated content is missing for section: "
                                + section
                );
            }

            completeContent.append("\n\n");

            if (section.equals("TITLE")) {
                completeContent.append(generatedTitle);
            } else {
                completeContent.append(content.trim());
            }

            completeContent.append("\n");
        }

        // Prepare draft for database
        DraftRequest draftRequest = new DraftRequest();

        draftRequest.setTitle(generatedTitle);
        draftRequest.setTopic(request.getTopic());
        draftRequest.setContent(
                completeContent.toString().trim()
        );

        // Save generated paper in MySQL
        DraftResponse savedDraft =
                draftService.saveDraft(draftRequest);

        // Return saved paper response
        return new GeneratePaperResponse(
                savedDraft.getId(),
                savedDraft.getTitle(),
                savedDraft.getTopic(),
                savedDraft.getContent(),
                "Complete research paper generated and saved successfully"
        );
    }

    // Clean AI-generated title
    private String cleanGeneratedTitle(String title) {

        if (title == null || title.isBlank()) {
            throw new RuntimeException(
                    "Generated research paper title is empty"
            );
        }

        return title
                .replaceFirst(
                        "(?is)^\\s*(?:#{1,6}\\s*)?\\*{0,2}title\\*{0,2}\\s*[:\\-]?\\s*",
                        ""
                )
                .replaceAll(
                        "(?i)\\s*[-–—:]?\\s*\\[(?:Verified academic source required|Research data required)\\]",
                        ""
                )
                .replaceAll("\\*{1,2}", "")
                .trim();
    }
}
