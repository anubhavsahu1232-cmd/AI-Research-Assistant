package com.researchassistant.research_assistant_backend.repository;

import com.researchassistant.research_assistant_backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);
}
