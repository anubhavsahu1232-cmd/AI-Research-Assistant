package com.researchassistant.research_assistant_backend.service;

import com.researchassistant.research_assistant_backend.dto.response.BookmarkResponse;
import com.researchassistant.research_assistant_backend.entity.*;
import com.researchassistant.research_assistant_backend.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarks;
    private final UserRepository users;
    private final ResearchPaperRepository papers;

    public BookmarkService(BookmarkRepository bookmarks,
                           UserRepository users,
                           ResearchPaperRepository papers) {
        this.bookmarks = bookmarks;
        this.users = users;
        this.papers = papers;
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return users.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));
    }

    @Transactional
    public BookmarkResponse addBookmark(Long paperId) {
        User user = currentUser();

        ResearchPaper paper = papers.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Research paper not found"));

        if (bookmarks.existsByUser_IdAndPaper_Id(user.getId(), paperId)) {
            throw new RuntimeException("Paper is already bookmarked");
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setPaper(paper);

        Bookmark saved = bookmarks.saveAndFlush(bookmark);

        return new BookmarkResponse(
                saved.getId(),
                paper.getId(),
                paper.getTitle(),
                saved.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<BookmarkResponse> getMyBookmarks() {
        User user = currentUser();

        return bookmarks.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(b -> new BookmarkResponse(
                        b.getId(),
                        b.getPaper().getId(),
                        b.getPaper().getTitle(),
                        b.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public void removeBookmark(Long paperId) {
        User user = currentUser();

        Bookmark bookmark = bookmarks.findByUser_IdAndPaper_Id(
                user.getId(), paperId
        ).orElseThrow(() -> new RuntimeException("Bookmark not found"));

        bookmarks.delete(bookmark);
    }
}