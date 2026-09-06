package com.teampulse.backend.controller;

import com.teampulse.backend.dto.ReportReviewResponse;
import com.teampulse.backend.dto.ReviewRequest;
import com.teampulse.backend.dto.WeeklyReportResponse;
import com.teampulse.backend.service.ReportReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportReviewController {

    private final ReportReviewService reportReviewService;

    @PostMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<WeeklyReportResponse> reviewReport(@PathVariable Long id, @Valid @RequestBody ReviewRequest request, Authentication authentication) {
        return ResponseEntity.ok(reportReviewService.reviewReport(id, request, authentication.getName()));
    }

    @GetMapping("/{id}/reviews")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<ReportReviewResponse>> getReportReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reportReviewService.getReportReviews(id));
    }
}