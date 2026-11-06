package com.researchassistant.research_assistant_backend.dto.response;

import com.researchassistant.research_assistant_backend.entity.Note;
import java.time.LocalDateTime;

public class NoteResponse {
    private Long id;
    private Long paperId;
    private String paperTitle;
    private String content;
    private LocalDateTime createdAt;

    public NoteResponse(Note note) {
        this.id = note.getId();
        this.paperId = note.getPaper().getId();
        this.paperTitle = note.getPaper().getTitle();
        this.content = note.getContent();
        this.createdAt = note.getCreatedAt();
    }

    public Long getId() { return id; }
    public Long getPaperId() { return paperId; }
    public String getPaperTitle() { return paperTitle; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}