package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.dto.response.UserResponse;
import com.researchassistant.research_assistant_backend.entity.User;
import com.researchassistant.research_assistant_backend.repository.UserRepository;
import com.researchassistant.research_assistant_backend.repository.DraftRepository;
import com.researchassistant.research_assistant_backend.repository.ResearchPaperRepository;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final DraftRepository draftRepository;
    private final ResearchPaperRepository researchPaperRepository;

    public AdminController(
            UserRepository userRepository,
            DraftRepository draftRepository,
            ResearchPaperRepository researchPaperRepository) {
        this.userRepository = userRepository;
        this.draftRepository = draftRepository;
        this.researchPaperRepository = researchPaperRepository;
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole() == null ? "USER" : user.getRole().name(),
                        user.getCreatedAt()
                ))
                .toList();
    }

    @GetMapping("/stats")
    public Map<String, Long> getAdminStats() {
        return Map.of(
                "totalUsers", userRepository.count(),
                "totalDrafts", draftRepository.count(),
                "totalResearchPapers", researchPaperRepository.count()
        );
    }
}