package com.researchassistant.research_assistant_backend.repository;

import com.researchassistant.research_assistant_backend.entity.ReadingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReadingHistoryRepository extends JpaRepository<ReadingHistory, Long> {
    List<ReadingHistory> findByUser_IdOrderByViewedAtDesc(Long userId);
    void deleteByUser_Id(Long userId);
}