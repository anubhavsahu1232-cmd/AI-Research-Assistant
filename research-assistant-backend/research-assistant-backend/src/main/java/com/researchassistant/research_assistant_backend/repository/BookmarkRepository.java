package com.researchassistant.research_assistant_backend.repository;

import com.researchassistant.research_assistant_backend.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByUser_IdOrderByCreatedAtDesc(Long userId);

    boolean existsByUser_IdAndPaper_Id(Long userId, Long paperId);

    Optional<Bookmark> findByUser_IdAndPaper_Id(Long userId, Long paperId);
}