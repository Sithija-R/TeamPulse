package com.teampulse.backend.dto;

import java.time.LocalDateTime;

public record RecentActivityResponse(
        Long reportId,
        String memberName,
        String action,
        String comment,
        LocalDateTime createdAt
) {}