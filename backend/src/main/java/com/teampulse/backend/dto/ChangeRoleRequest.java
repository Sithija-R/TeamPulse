package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.Role;

public record ChangeRoleRequest(
        Role role
) {
}