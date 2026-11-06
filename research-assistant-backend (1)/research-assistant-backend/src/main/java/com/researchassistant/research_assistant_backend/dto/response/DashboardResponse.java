package com.researchassistant.research_assistant_backend.dto.response;

public class DashboardResponse {

    private long totalUsers;
    private long totalResearchPapers;
    private long totalDrafts;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalUsers, long totalResearchPapers, long totalDrafts) {
        this.totalUsers = totalUsers;
        this.totalResearchPapers = totalResearchPapers;
        this.totalDrafts = totalDrafts;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalResearchPapers() {
        return totalResearchPapers;
    }

    public void setTotalResearchPapers(long totalResearchPapers) {
        this.totalResearchPapers = totalResearchPapers;
    }

    public long getTotalDrafts() {
        return totalDrafts;
    }

    public void setTotalDrafts(long totalDrafts) {
        this.totalDrafts = totalDrafts;
    }
}
