package com.researchassistant.research_assistant_backend.controller;

import com.researchassistant.research_assistant_backend.dto.response.DashboardResponse;
import com.researchassistant.research_assistant_backend.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardResponse getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
}
