package com.researchassistant.research_assistant_backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ResearchPaperRequest {

    @NotBlank(message = "Paper title is required")
    private String title;

    private String authors;
    private String journal;
    private String publicationYear;
    private String doi;
    private String abstractText;
    private String fileUrl;

    public ResearchPaperRequest() {
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthors() { return authors; }
    public void setAuthors(String authors) { this.authors = authors; }

    public String getJournal() { return journal; }
    public void setJournal(String journal) { this.journal = journal; }

    public String getPublicationYear() { return publicationYear; }
    public void setPublicationYear(String publicationYear) { this.publicationYear = publicationYear; }

    public String getDoi() { return doi; }
    public void setDoi(String doi) { this.doi = doi; }

    public String getAbstractText() { return abstractText; }
    public void setAbstractText(String abstractText) { this.abstractText = abstractText; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
}
