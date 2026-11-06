package com.researchassistant.research_assistant_backend.dto.response;

import java.time.LocalDateTime;

public class BookmarkResponse {

    private Long id;
    private Long paperId;
    private String paperTitle;
    private LocalDateTime createdAt;

    public BookmarkResponse(Long id, Long paperId, String paperTitle, LocalDateTime createdAt) {
        this.id = id;
        this.paperId = paperId;
        this.paperTitle = paperTitle;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getPaperId() { return paperId; }
    public String getPaperTitle() { return paperTitle; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}