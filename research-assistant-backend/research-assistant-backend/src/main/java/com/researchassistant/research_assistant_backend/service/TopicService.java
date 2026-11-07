package com.researchassistant.research_assistant_backend.service;

import com.researchassistant.research_assistant_backend.entity.Topic;
import com.researchassistant.research_assistant_backend.repository.TopicRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.List;

@Service
public class TopicService {

    private final TopicRepository repository;

    public TopicService(TopicRepository repository) {
        this.repository = repository;
    }

    public List<Topic> getAll() {
        return repository.findAll();
    }

    public Topic create(Topic topic) {
        validate(topic);
        if (repository.existsByNameIgnoreCase(topic.getName().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Topic already exists");
        }
        topic.setName(topic.getName().trim());
        return repository.save(topic);
    }

    public Topic update(Long id, Topic topic) {
        Topic existing = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        validate(topic);
        String name = topic.getName().trim();

        boolean duplicate = repository.findAll().stream()
            .anyMatch(t -> !t.getId().equals(id) && t.getName().equalsIgnoreCase(name));

        if (duplicate) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Topic already exists");
        }

        existing.setName(name);
        existing.setDescription(topic.getDescription());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found");
        }
        try {
            repository.deleteById(id);
            repository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Topic is in use and cannot be deleted");
        }
    }

    private void validate(Topic topic) {
        if (topic == null || topic.getName() == null || topic.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Topic name is required");
        }
    }
}
