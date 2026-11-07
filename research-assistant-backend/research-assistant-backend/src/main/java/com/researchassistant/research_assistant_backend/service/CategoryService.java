package com.researchassistant.research_assistant_backend.service;

import com.researchassistant.research_assistant_backend.entity.Category;
import com.researchassistant.research_assistant_backend.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public List<Category> getAll() {
        return repository.findAll();
    }

    public Category create(Category category) {
        validate(category);
        if (repository.existsByNameIgnoreCase(category.getName().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        }
        category.setName(category.getName().trim());
        return repository.save(category);
    }

    public Category update(Long id, Category category) {
        Category existing = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        validate(category);
        String name = category.getName().trim();

        boolean duplicate = repository.findAll().stream()
            .anyMatch(c -> !c.getId().equals(id) && c.getName().equalsIgnoreCase(name));

        if (duplicate) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        }

        existing.setName(name);
        existing.setDescription(category.getDescription());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }
        try {
            repository.deleteById(id);
            repository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category is in use and cannot be deleted");
        }
    }

    private void validate(Category category) {
        if (category == null || category.getName() == null || category.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name is required");
        }
    }
}
