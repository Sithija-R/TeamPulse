package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.Role;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String email,
        Role role
) {
}
