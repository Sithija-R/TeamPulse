package com.teampulse.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record BlockerRequest(

        @NotBlank
        String description,

        boolean keyIssue,
        boolean resolved
) {}