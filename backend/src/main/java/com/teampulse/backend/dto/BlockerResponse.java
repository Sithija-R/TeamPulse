package com.teampulse.backend.dto;

public record BlockerResponse(
        Long id,
        String description,
        boolean keyIssue,
        boolean resolved
) {}