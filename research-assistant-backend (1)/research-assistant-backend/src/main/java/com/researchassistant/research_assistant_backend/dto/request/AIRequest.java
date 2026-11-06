package com.researchassistant.research_assistant_backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AIRequest {

    @NotBlank(message = "Research topic is required")
    private String topic;

    @NotBlank(message = "Section is required")
    private String section;

    private String instructions;

    public AIRequest() {
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
