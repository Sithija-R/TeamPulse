package com.teampulse.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record WeeklyReportRequest(

        @NotNull
        Long projectId,

        @NotNull
        LocalDate weekStartDate,

        @NotNull
        LocalDate weekEndDate,

        String nextWeekTasks,

        String notes,

        @Valid
        List<ReportTaskRequest> tasks,

        @Valid
        List<BlockerRequest> blockers,

        @Valid
        List<AchievementRequest> achievements,

        @Valid
        List<TimeEntryRequest> timeEntries
) {}