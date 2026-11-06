package com.researchassistant.research_assistant_backend.service;

import com.researchassistant.research_assistant_backend.dto.response.DashboardResponse;
import com.researchassistant.research_assistant_backend.repository.DraftRepository;
import com.researchassistant.research_assistant_backend.repository.ResearchPaperRepository;
import com.researchassistant.research_assistant_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ResearchPaperRepository researchPaperRepository;
    private final DraftRepository draftRepository;

    public DashboardService(
            UserRepository userRepository,
            ResearchPaperRepository researchPaperRepository,
            DraftRepository draftRepository) {
        this.userRepository = userRepository;
        this.researchPaperRepository = researchPaperRepository;
        this.draftRepository = draftRepository;
    }

    public DashboardResponse getDashboardStats() {
        return new DashboardResponse(
                userRepository.count(),
                researchPaperRepository.count(),
                draftRepository.count()
        );
    }
}
