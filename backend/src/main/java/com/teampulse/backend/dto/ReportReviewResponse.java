package com.teampulse.backend.dto;

import com.teampulse.backend.model.enums.ReviewAction;
import java.time.LocalDateTime;

public record ReportReviewResponse(
        Long id,
        Long managerId,
        String managerName,
        Integer versionNumber,
        ReviewAction action,
        String comment,
        LocalDateTime createdAt
) {}