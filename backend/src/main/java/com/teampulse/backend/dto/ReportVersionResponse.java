package com.teampulse.backend.dto;

import java.time.LocalDateTime;

public record ReportVersionResponse(
        Long id,
        Integer versionNumber,
        LocalDateTime createdAt,
        String contentSnapshot
) {}