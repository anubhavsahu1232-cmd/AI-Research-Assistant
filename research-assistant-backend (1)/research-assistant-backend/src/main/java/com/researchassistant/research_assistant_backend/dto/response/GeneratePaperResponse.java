package com.researchassistant.research_assistant_backend.dto.response;

public class GeneratePaperResponse {

    private Long draftId;
    private String title;
    private String topic;
    private String content;
    private String message;

    public GeneratePaperResponse() {
    }

    public GeneratePaperResponse(
            Long draftId,
            String title,
            String topic,
            String content,
            String message) {
        this.draftId = draftId;
        this.title = title;
        this.topic = topic;
        this.content = content;
        this.message = message;
    }

    public Long getDraftId() {
        return draftId;
    }

    public void setDraftId(Long draftId) {
        this.draftId = draftId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
