package com.researchassistant.research_assistant_backend.service;

import com.researchassistant.research_assistant_backend.dto.request.NoteRequest;
import com.researchassistant.research_assistant_backend.dto.response.NoteResponse;
import com.researchassistant.research_assistant_backend.entity.Note;
import com.researchassistant.research_assistant_backend.entity.User;
import com.researchassistant.research_assistant_backend.repository.NoteRepository;
import com.researchassistant.research_assistant_backend.repository.UserRepository;
import com.researchassistant.research_assistant_backend.repository.ResearchPaperRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class NoteService {
    private final NoteRepository notes;
    private final UserRepository users;
    private final ResearchPaperRepository papers;

    public NoteService(NoteRepository notes, UserRepository users, ResearchPaperRepository papers) {
        this.notes = notes;
        this.users = users;
        this.papers = papers;
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return users.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotes() {
        User user = currentUser();
        return notes.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream().map(NoteResponse::new).toList();
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesByPaper(Long paperId) {
        User user = currentUser();
        return notes.findByUser_IdAndPaper_IdOrderByCreatedAtDesc(user.getId(), paperId)
                .stream().map(NoteResponse::new).toList();
    }

    @Transactional
    public NoteResponse createNote(Long paperId, NoteRequest request) {
        User user = currentUser();

        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new IllegalArgumentException("Note content cannot be empty");
        }

        var paper = papers.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Research paper not found"));

        Note note = new Note();
        note.setUser(user);
        note.setPaper(paper);
        note.setContent(request.getContent().trim());

        return new NoteResponse(notes.save(note));
    }

    @Transactional
    public NoteResponse updateNote(Long noteId, NoteRequest request) {
        User user = currentUser();

        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new IllegalArgumentException("Note content cannot be empty");
        }

        Note note = notes.findByIdAndUser_Id(noteId, user.getId())
                .orElseThrow(() -> new RuntimeException("Note not found"));

        note.setContent(request.getContent().trim());
        return new NoteResponse(notes.save(note));
    }

    @Transactional
    public void deleteNote(Long noteId) {
        User user = currentUser();
        Note note = notes.findByIdAndUser_Id(noteId, user.getId())
                .orElseThrow(() -> new RuntimeException("Note not found"));
        notes.delete(note);
    }
}