package com.teampulse.backend.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
