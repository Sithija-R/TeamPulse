package com.teampulse.backend.service;

import com.teampulse.backend.dto.ReportVersionResponse;
import com.teampulse.backend.exception.ResourceNotFoundException;
import com.teampulse.backend.model.ReportVersion;
import com.teampulse.backend.repository.ReportVersionRepository;
import com.teampulse.backend.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportVersionService {

    private final ReportVersionRepository reportVersionRepository;
    private final WeeklyReportRepository reportRepository;

    @Transactional(readOnly = true)
    public List<ReportVersionResponse> getReportVersions(Long reportId) {
        reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        return reportVersionRepository.findByReportIdOrderByVersionNumberDesc(reportId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReportVersionResponse getReportVersion(Long reportId, Integer versionNumber) {
        ReportVersion version = reportVersionRepository
                .findByReportIdAndVersionNumber(reportId, versionNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Report version not found"));

        return toResponse(version);
    }

    public ReportVersion getLatestVersion(Long reportId) {
        return reportVersionRepository
                .findTopByReportIdOrderByVersionNumberDesc(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report version not found"));
    }

    private ReportVersionResponse toResponse(ReportVersion version) {
        return new ReportVersionResponse(
                version.getId(),
                version.getVersionNumber(),
                version.getCreatedAt(),
                version.getContentSnapshot()
        );
    }
}