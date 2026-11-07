package com.researchassistant.research_assistant_backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class GeneratePaperRequest {

    @NotBlank(message = "Research topic is required")
    private String topic;

    private String instructions;

    public GeneratePaperRequest() {
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
