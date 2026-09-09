package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.Priority;
import com.teampulse.backend.model.enums.TaskStatus;

public record ReportTaskResponse(
        Long id,
        String taskName,
        Priority priority,
        Integer plannedPercentage,
        Integer actualPercentage,
        TaskStatus status,
        Double plannedHours,
        Double actualHours,
        String deliverable
) {}