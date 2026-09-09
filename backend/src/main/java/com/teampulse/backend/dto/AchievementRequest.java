package com.teampulse.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AchievementRequest(

        @NotBlank
        String description,

        boolean keyAchievement
) {}