package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.dto.request.DraftRequest;
import com.researchassistant.research_assistant_backend.dto.response.DraftResponse;
import com.researchassistant.research_assistant_backend.service.DraftService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drafts")
public class DraftController {

    private final DraftService draftService;

    public DraftController(DraftService draftService) {
        this.draftService = draftService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DraftResponse saveDraft(@Valid @RequestBody DraftRequest request) {
        return draftService.saveDraft(request);
    }

    @GetMapping
    public List<DraftResponse> getAllDrafts() {
        return draftService.getAllDrafts();
    }

    @GetMapping("/{id}")
    public DraftResponse getDraft(@PathVariable Long id) {
        return draftService.getDraftById(id);
    }

    @PutMapping("/{id}")
    public DraftResponse updateDraft(
            @PathVariable Long id,
            @Valid @RequestBody DraftRequest request) {
        return draftService.updateDraft(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDraft(@PathVariable Long id) {
        draftService.deleteDraft(id);
    }
}
