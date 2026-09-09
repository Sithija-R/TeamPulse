package com.teampulse.backend.dto;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        boolean active
) {
}
