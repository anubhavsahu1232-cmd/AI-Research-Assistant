package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.dto.request.NoteRequest;
import com.researchassistant.research_assistant_backend.dto.response.NoteResponse;
import com.researchassistant.research_assistant_backend.service.NoteService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<NoteResponse> getAllNotes() {
        return noteService.getAllNotes();
    }

    @GetMapping("/paper/{paperId}")
    public List<NoteResponse> getNotesByPaper(@PathVariable Long paperId) {
        return noteService.getNotesByPaper(paperId);
    }

    @PostMapping("/{paperId}")
    public NoteResponse createNote(@PathVariable Long paperId, @RequestBody NoteRequest request) {
        return noteService.createNote(paperId, request);
    }

    @PutMapping("/{noteId}")
    public NoteResponse updateNote(@PathVariable Long noteId, @RequestBody NoteRequest request) {
        return noteService.updateNote(noteId, request);
    }

    @DeleteMapping("/{noteId}")
    public void deleteNote(@PathVariable Long noteId) {
        noteService.deleteNote(noteId);
    }
}