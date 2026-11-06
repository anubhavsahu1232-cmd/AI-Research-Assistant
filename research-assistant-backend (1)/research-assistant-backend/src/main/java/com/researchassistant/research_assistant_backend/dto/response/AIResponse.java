package com.researchassistant.research_assistant_backend.dto.response;

public class AIResponse {

    private String content;
    private String message;

    public AIResponse() {
    }

    public AIResponse(String content, String message) {
        this.content = content;
        this.message = message;
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
