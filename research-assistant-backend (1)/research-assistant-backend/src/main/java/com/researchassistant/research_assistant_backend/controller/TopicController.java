package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.entity.Topic;
import com.researchassistant.research_assistant_backend.service.TopicService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService service;

    public TopicController(TopicService service) {
        this.service = service;
    }

    @GetMapping
    public List<Topic> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Topic create(@RequestBody Topic topic) {
        return service.create(topic);
    }

    @PutMapping("/{id}")
    public Topic update(@PathVariable Long id, @RequestBody Topic topic) {
        return service.update(id, topic);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
