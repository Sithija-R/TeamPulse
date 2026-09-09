package com.teampulse.backend.dto;

public record AchievementResponse(
        Long id,
        String description,
        boolean keyAchievement
) {}