package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.TaskType;
import jakarta.validation.constraints.NotNull;

public record TimeEntryRequest(

        @NotNull
        TaskType taskType,

        @NotNull
        Double hours
) {}