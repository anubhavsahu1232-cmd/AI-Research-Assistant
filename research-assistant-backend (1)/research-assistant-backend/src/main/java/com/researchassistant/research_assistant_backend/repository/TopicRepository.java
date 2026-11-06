package com.researchassistant.research_assistant_backend.repository;

import com.researchassistant.research_assistant_backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    boolean existsByNameIgnoreCase(String name);
}
