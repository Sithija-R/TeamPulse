package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.TaskType;

public record TimeEntryResponse(
        Long id,
        TaskType taskType,
        Double hours
) {}