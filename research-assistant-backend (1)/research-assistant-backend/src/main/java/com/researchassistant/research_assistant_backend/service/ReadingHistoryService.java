package com.researchassistant.research_assistant_backend.service;

import com.researchassistant.research_assistant_backend.dto.response.ReadingHistoryResponse;
import com.researchassistant.research_assistant_backend.entity.ReadingHistory;
import com.researchassistant.research_assistant_backend.entity.User;
import com.researchassistant.research_assistant_backend.repository.ReadingHistoryRepository;
import com.researchassistant.research_assistant_backend.repository.UserRepository;
import com.researchassistant.research_assistant_backend.repository.ResearchPaperRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReadingHistoryService {
    private final ReadingHistoryRepository historyRepository;
    private final UserRepository users;
    private final ResearchPaperRepository papers;

    public ReadingHistoryService(ReadingHistoryRepository historyRepository,
                                 UserRepository users,
                                 ResearchPaperRepository papers) {
        this.historyRepository = historyRepository;
        this.users = users;
        this.papers = papers;
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return users.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public ReadingHistoryResponse recordView(Long paperId) {
        User user = currentUser();

        var paper = papers.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Research paper not found"));

        ReadingHistory history = new ReadingHistory();
        history.setUser(user);
        history.setPaper(paper);

        return new ReadingHistoryResponse(historyRepository.save(history));
    }

    @Transactional(readOnly = true)
    public List<ReadingHistoryResponse> getHistory() {
        User user = currentUser();
        return historyRepository.findByUser_IdOrderByViewedAtDesc(user.getId())
                .stream().map(ReadingHistoryResponse::new).toList();
    }

    @Transactional
    public void clearHistory() {
        User user = currentUser();
        historyRepository.deleteByUser_Id(user.getId());
    }
}