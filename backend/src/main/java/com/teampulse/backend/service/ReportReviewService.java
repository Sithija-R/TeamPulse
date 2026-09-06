package com.teampulse.backend.service;

import com.teampulse.backend.dto.ReportReviewResponse;
import com.teampulse.backend.dto.ReviewRequest;
import com.teampulse.backend.dto.WeeklyReportResponse;
import com.teampulse.backend.exception.OperationNotAllowedException;
import com.teampulse.backend.exception.ResourceNotFoundException;
import com.teampulse.backend.model.ReportReview;
import com.teampulse.backend.model.ReportVersion;
import com.teampulse.backend.model.User;
import com.teampulse.backend.model.WeeklyReport;
import com.teampulse.backend.model.enums.ReportStatus;
import com.teampulse.backend.model.enums.ReviewAction;
import com.teampulse.backend.repository.ReportReviewRepository;
import com.teampulse.backend.repository.WeeklyReportRepository;
import com.teampulse.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportReviewService {

    private final ReportReviewRepository reportReviewRepository;
    private final WeeklyReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReportVersionService reportVersionService;

    @Transactional
    public WeeklyReportResponse reviewReport(Long reportId, ReviewRequest request, String email) {
        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WeeklyReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        if (report.getStatus() != ReportStatus.SUBMITTED) {
            throw new OperationNotAllowedException("Only submitted reports can be reviewed");
        }

        if (request.comment() == null || request.comment().isBlank()) {
            throw new OperationNotAllowedException("Comment is required for review");
        }

        ReportVersion version = reportVersionService.getLatestVersion(reportId);

        ReportReview review = ReportReview.builder()
                .report(report)
                .manager(manager)
                .version(version)
                .action(request.action())
                .comment(request.comment())
                .createdAt(LocalDateTime.now())
                .build();

        reportReviewRepository.save(review);

        if (request.action() == ReviewAction.APPROVED) {
            report.setStatus(ReportStatus.APPROVED);
            report.setApprovedAt(LocalDateTime.now());
        } else {
            report.setStatus(ReportStatus.NEEDS_CORRECTION);
            report.setApprovedAt(null);
        }

        reportRepository.save(report);

        return toResponse(report);
    }

    @Transactional(readOnly = true)
    public List<ReportReviewResponse> getReportReviews(Long reportId) {
        reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        return reportReviewRepository.findByReportIdOrderByCreatedAtDesc(reportId)
                .stream()
                .map(review -> new ReportReviewResponse(
                        review.getId(),
                        review.getManager().getId(),
                        review.getManager().getName(),
                        review.getVersion().getVersionNumber(),
                        review.getAction(),
                        review.getComment(),
                        review.getCreatedAt()
                ))
                .toList();
    }

    private WeeklyReportResponse toResponse(WeeklyReport report) {
        return new WeeklyReportResponse(
                report.getId(),
                report.getUser().getId(),
                report.getUser().getName(),
                report.getProject().getId(),
                report.getProject().getName(),
                report.getWeekStartDate(),
                report.getWeekEndDate(),
                report.getStatus(),
                report.getNextWeekTasks(),
                report.getNotes(),
                report.getSubmittedAt(),
                report.getApprovedAt(),
                report.getTasks().stream().map(task -> new com.teampulse.backend.dto.ReportTaskResponse(
                        task.getId(),
                        task.getTaskName(),
                        task.getPriority(),
                        task.getPlannedPercentage(),
                        task.getActualPercentage(),
                        task.getStatus(),
                        task.getPlannedHours(),
                        task.getActualHours(),
                        task.getDeliverable()
                )).toList(),
                report.getBlockers().stream().map(blocker -> new com.teampulse.backend.dto.BlockerResponse(
                        blocker.getId(),
                        blocker.getDescription(),
                        blocker.isKeyIssue(),
                        blocker.isResolved()
                )).toList(),
                report.getAchievements().stream().map(achievement -> new com.teampulse.backend.dto.AchievementResponse(
                        achievement.getId(),
                        achievement.getDescription(),
                        achievement.isKeyAchievement()
                )).toList(),
                report.getTimeEntries().stream().map(timeEntry -> new com.teampulse.backend.dto.TimeEntryResponse(
                        timeEntry.getId(),
                        timeEntry.getTaskType(),
                        timeEntry.getHours()
                )).toList()
        );
    }
}