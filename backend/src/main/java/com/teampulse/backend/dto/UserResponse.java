package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.Role;

public record UserResponse(
        Long id,
        String name,
        String email,
        Role role
) {
}
