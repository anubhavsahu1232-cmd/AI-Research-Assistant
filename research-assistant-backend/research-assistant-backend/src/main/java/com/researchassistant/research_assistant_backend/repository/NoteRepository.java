package com.researchassistant.research_assistant_backend.repository;

import com.researchassistant.research_assistant_backend.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser_IdOrderByCreatedAtDesc(Long userId);
    List<Note> findByUser_IdAndPaper_IdOrderByCreatedAtDesc(Long userId, Long paperId);
    Optional<Note> findByIdAndUser_Id(Long id, Long userId);
}