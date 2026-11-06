package com.researchassistant.research_assistant_backend.dto.response;

import com.researchassistant.research_assistant_backend.entity.ReadingHistory;
import java.time.LocalDateTime;

public class ReadingHistoryResponse {
    private Long id;
    private Long paperId;
    private String paperTitle;
    private LocalDateTime viewedAt;

    public ReadingHistoryResponse(ReadingHistory history) {
        this.id = history.getId();
        this.paperId = history.getPaper().getId();
        this.paperTitle = history.getPaper().getTitle();
        this.viewedAt = history.getViewedAt();
    }

    public Long getId() { return id; }
    public Long getPaperId() { return paperId; }
    public String getPaperTitle() { return paperTitle; }
    public LocalDateTime getViewedAt() { return viewedAt; }
}