package com.teampulse.backend.controller;

import com.teampulse.backend.dto.ReportVersionResponse;
import com.teampulse.backend.service.ReportVersionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportVersionController {

    private final ReportVersionService reportVersionService;

    @GetMapping("/{id}/versions")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<ReportVersionResponse>> getReportVersions(@PathVariable Long id) {
        return ResponseEntity.ok(reportVersionService.getReportVersions(id));
    }

    @GetMapping("/{id}/versions/{versionNumber}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ReportVersionResponse> getReportVersion(@PathVariable Long id, @PathVariable Integer versionNumber) {
        return ResponseEntity.ok(reportVersionService.getReportVersion(id, versionNumber));
    }
}