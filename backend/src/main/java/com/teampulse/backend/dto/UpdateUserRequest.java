package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank Role role

) {
}