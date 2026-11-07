package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.dto.response.ReadingHistoryResponse;
import com.researchassistant.research_assistant_backend.service.ReadingHistoryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reading-history")
public class ReadingHistoryController {
    private final ReadingHistoryService historyService;

    public ReadingHistoryController(ReadingHistoryService historyService) {
        this.historyService = historyService;
    }

    @PostMapping("/{paperId}")
    public ReadingHistoryResponse recordView(@PathVariable Long paperId) {
        return historyService.recordView(paperId);
    }

    @GetMapping
    public List<ReadingHistoryResponse> getHistory() {
        return historyService.getHistory();
    }

    @DeleteMapping
    public void clearHistory() {
        historyService.clearHistory();
    }
}