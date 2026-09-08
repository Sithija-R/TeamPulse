package com.teampulse.backend.controller;

import com.teampulse.backend.dto.WeeklyReportRequest;
import com.teampulse.backend.dto.WeeklyReportResponse;
import com.teampulse.backend.model.enums.ReportStatus;
import com.teampulse.backend.service.WeeklyReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class WeeklyReportController {

    private final WeeklyReportService reportService;

    @PostMapping
    public ResponseEntity<WeeklyReportResponse> createReport(@Valid @RequestBody WeeklyReportRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(reportService.createReport(request, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<WeeklyReportResponse>> getMyReports(Authentication authentication) {
        return ResponseEntity.ok(reportService.getMyReports(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeeklyReportResponse> getMyReport(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(reportService.getMyReport(id, authentication.getName()));
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<WeeklyReportResponse> getById(@PathVariable Long id, Authentication authentication) {
        System.out.println("User: " + authentication.getName());
        System.out.println("Authorities: " + authentication.getAuthorities());
    
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeeklyReportResponse> updateReport(@PathVariable Long id,
            @Valid @RequestBody WeeklyReportRequest request, Authentication authentication) {
        return ResponseEntity.ok(reportService.updateReport(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id, Authentication authentication) {
        reportService.deleteReport(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<WeeklyReportResponse> submitReport(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(reportService.submitReport(id, authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<WeeklyReportResponse>> getAllReports(
            @RequestParam(required = false) Long memberId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(
                reportService.getFilteredReports(memberId, projectId, status, startDate, endDate));
    }
}