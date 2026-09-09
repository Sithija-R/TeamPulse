package com.teampulse.backend.dto;


public record UserResponse(
        Long id,
        String name,
        String email,
        String role
) {
}
