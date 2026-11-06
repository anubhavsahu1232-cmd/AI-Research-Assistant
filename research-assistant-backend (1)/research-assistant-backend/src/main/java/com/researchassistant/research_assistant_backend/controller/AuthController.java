package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.dto.request.AuthRequest;
import com.researchassistant.research_assistant_backend.dto.request.RegisterRequest;
import com.researchassistant.research_assistant_backend.dto.response.AuthResponse;
import com.researchassistant.research_assistant_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }
}
