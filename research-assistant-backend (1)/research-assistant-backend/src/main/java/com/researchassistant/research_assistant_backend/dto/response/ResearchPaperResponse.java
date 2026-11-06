package com.researchassistant.research_assistant_backend.dto.response;

import java.time.LocalDateTime;

public class ResearchPaperResponse {

    private Long id;
    private String title;
    private String authors;
    private String journal;
    private String publicationYear;
    private String doi;
    private String abstractText;
    private String fileUrl;
    private LocalDateTime createdAt;

    public ResearchPaperResponse() {
    }

    public ResearchPaperResponse(Long id, String title, String authors,
            String journal, String publicationYear, String doi,
            String abstractText, String fileUrl, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.authors = authors;
        this.journal = journal;
        this.publicationYear = publicationYear;
        this.doi = doi;
        this.abstractText = abstractText;
        this.fileUrl = fileUrl;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthors() { return authors; }
    public String getJournal() { return journal; }
    public String getPublicationYear() { return publicationYear; }
    public String getDoi() { return doi; }
    public String getAbstractText() { return abstractText; }
    public String getFileUrl() { return fileUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setAuthors(String authors) { this.authors = authors; }
    public void setJournal(String journal) { this.journal = journal; }
    public void setPublicationYear(String publicationYear) { this.publicationYear = publicationYear; }
    public void setDoi(String doi) { this.doi = doi; }
    public void setAbstractText(String abstractText) { this.abstractText = abstractText; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
