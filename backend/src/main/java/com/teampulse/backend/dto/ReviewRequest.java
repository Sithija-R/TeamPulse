package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.ReviewAction;
import jakarta.validation.constraints.NotNull;

public record ReviewRequest(
        @NotNull ReviewAction action,
        String comment
) {}