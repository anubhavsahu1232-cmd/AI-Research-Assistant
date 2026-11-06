package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.dto.response.BookmarkResponse;
import com.researchassistant.research_assistant_backend.service.BookmarkService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService service;

    public BookmarkController(BookmarkService service) {
        this.service = service;
    }

    @PostMapping("/{paperId}")
    @ResponseStatus(HttpStatus.CREATED)
    public BookmarkResponse addBookmark(@PathVariable Long paperId) {
        return service.addBookmark(paperId);
    }

    @GetMapping
    public List<BookmarkResponse> getMyBookmarks() {
        return service.getMyBookmarks();
    }

    @DeleteMapping("/{paperId}")
    public Map<String, String> removeBookmark(@PathVariable Long paperId) {
        service.removeBookmark(paperId);
        return Map.of("message", "Bookmark removed successfully");
    }
}