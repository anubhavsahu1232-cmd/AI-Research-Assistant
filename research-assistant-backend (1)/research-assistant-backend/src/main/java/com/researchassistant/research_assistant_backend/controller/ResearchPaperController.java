package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.dto.request.ResearchPaperRequest;
import com.researchassistant.research_assistant_backend.dto.response.ResearchPaperResponse;
import com.researchassistant.research_assistant_backend.service.ResearchPaperService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/research-papers")
public class ResearchPaperController {

    private final ResearchPaperService researchPaperService;

    public ResearchPaperController(ResearchPaperService researchPaperService) {
        this.researchPaperService = researchPaperService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResearchPaperResponse save(@Valid @RequestBody ResearchPaperRequest request) {
        return researchPaperService.save(request);
    }

    @GetMapping
    public List<ResearchPaperResponse> getAll() {
        return researchPaperService.getAll();
    }

    @GetMapping("/{id}")
    public ResearchPaperResponse getById(@PathVariable Long id) {
        return researchPaperService.getById(id);
    }

    @PutMapping("/{id}")
    public ResearchPaperResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ResearchPaperRequest request) {
        return researchPaperService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        researchPaperService.delete(id);
    }
}
