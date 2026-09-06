package com.teampulse.backend.dto;

import java.util.List;
import java.util.Map;

public record DashboardResponse(
        long totalReports,
        long submittedThisWeek,
        double complianceRate,
        long draftCount,
        long submittedCount,
        long needsCorrectionCount,
        long approvedCount,
        long notStartedCount,
        long openBlockers,
        List<MemberStatusResponse> statusByMember,
        Map<String, Long> reportsByProject,
        Map<String, Double> timeByTaskType,
        List<RecentActivityResponse> recentActivity
) {}