package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.ReportStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record WeeklyReportResponse(
        Long id,
        Long userId,
        String userName,
        Long projectId,
        String projectName,
        LocalDate weekStartDate,
        LocalDate weekEndDate,
        ReportStatus status,
        String nextWeekTasks,
        String notes,
        LocalDateTime submittedAt,
        LocalDateTime approvedAt,
        List<ReportTaskResponse> tasks,
        List<BlockerResponse> blockers,
        List<AchievementResponse> achievements,
        List<TimeEntryResponse> timeEntries
) {}