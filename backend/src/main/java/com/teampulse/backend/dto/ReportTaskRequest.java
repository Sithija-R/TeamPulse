package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.Priority;
import com.teampulse.backend.model.enums.TaskStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReportTaskRequest(

        @NotBlank
        String taskName,

        @NotNull
        Priority priority,

        @Min(0)
        @Max(100)
        Integer plannedPercentage,

        @Min(0)
        @Max(100)
        Integer actualPercentage,

        @NotNull
        TaskStatus status,

        Double plannedHours,
        Double actualHours,
        String deliverable
) {}