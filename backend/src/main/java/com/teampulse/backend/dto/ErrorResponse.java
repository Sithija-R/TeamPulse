package com.teampulse.backend.dto;

public record ErrorResponse(
        int status,
        String message
) {
}
