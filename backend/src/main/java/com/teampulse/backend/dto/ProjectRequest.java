package com.teampulse.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record ProjectRequest(
        @NotBlank String name,
        String description,
        boolean active
) {
}
