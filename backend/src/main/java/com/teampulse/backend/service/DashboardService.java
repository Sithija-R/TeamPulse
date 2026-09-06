package com.teampulse.backend.service;

import com.teampulse.backend.dto.DashboardResponse;
import com.teampulse.backend.dto.MemberStatusResponse;
import com.teampulse.backend.dto.RecentActivityResponse;
import com.teampulse.backend.model.ReportReview;
import com.teampulse.backend.model.User;
import com.teampulse.backend.model.WeeklyReport;
import com.teampulse.backend.model.enums.ReportStatus;
import com.teampulse.backend.model.enums.Role;
import com.teampulse.backend.repository.ReportReviewRepository;
import com.teampulse.backend.repository.UserRepository;
import com.teampulse.backend.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final WeeklyReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReportReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(LocalDate weekStartDate) {
        LocalDate start = weekStartDate != null ? weekStartDate : LocalDate.now().with(DayOfWeek.MONDAY);

        LocalDate end = start.plusDays(6);

        List<WeeklyReport> reports = reportRepository.findAll()
                .stream()
                .filter(report -> !report.getWeekStartDate().isBefore(start)
                        && !report.getWeekEndDate().isAfter(end))
                .toList();

        List<User> members = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.TEAM_MEMBER)
                .toList();

        long totalMembers = members.size();

        long draftCount = reports.stream()
                .filter(report -> report.getStatus() == ReportStatus.DRAFT)
                .count();

        long submittedCount = reports.stream()
                .filter(report -> report.getStatus() == ReportStatus.SUBMITTED)
                .count();

        long needsCorrectionCount = reports.stream()
                .filter(report -> report.getStatus() == ReportStatus.NEEDS_CORRECTION)
                .count();

        long approvedCount = reports.stream()
                .filter(report -> report.getStatus() == ReportStatus.APPROVED)
                .count();

        long submittedThisWeek = reports.stream()
                .filter(report -> report.getSubmittedAt() != null
                        && !report.getSubmittedAt().toLocalDate().isBefore(start)
                        && !report.getSubmittedAt().toLocalDate().isAfter(end))
                .count();

        long startedReports = reports.stream()
                .filter(report -> report.getStatus() != ReportStatus.DRAFT)
                .map(report -> report.getUser().getId())
                .distinct()
                .count();

        long notStartedCount = Math.max(0, totalMembers - startedReports);

        double complianceRate = totalMembers == 0
                ? 0
                : ((double) startedReports / totalMembers) * 100;

        long openBlockers = reports.stream()
                .flatMap(report -> report.getBlockers().stream())
                .filter(blocker -> !blocker.isResolved())
                .count();

        List<MemberStatusResponse> statusByMember = getStatusByMember(members, reports);
        Map<String, Long> reportsByProject = getReportsByProject(reports);
        Map<String, Double> timeByTaskType = getTimeByTaskType(reports);
        List<RecentActivityResponse> recentActivity = getRecentActivity();

        return new DashboardResponse(
                reports.size(),
                submittedThisWeek,
                Math.round(complianceRate * 100.0) / 100.0,
                draftCount,
                submittedCount,
                needsCorrectionCount,
                approvedCount,
                notStartedCount,
                openBlockers,
                statusByMember,
                reportsByProject,
                timeByTaskType,
                recentActivity
        );
    }

    private List<MemberStatusResponse> getStatusByMember(List<User> members, List<WeeklyReport> reports) {
        List<MemberStatusResponse> result = new ArrayList<>();

        for (User member : members) {
            List<WeeklyReport> memberReports = reports.stream()
                    .filter(report -> report.getUser().getId().equals(member.getId()))
                    .toList();

            if (memberReports.isEmpty()) {
                result.add(new MemberStatusResponse(
                        member.getId(),
                        member.getName(),
                        "NOT_STARTED",
                        0
                ));
            } else {
                WeeklyReport latestReport = memberReports.get(0);

                result.add(new MemberStatusResponse(
                        member.getId(),
                        member.getName(),
                        latestReport.getStatus().name(),
                        memberReports.size()
                ));
            }
        }

        return result;
    }

    private Map<String, Long> getReportsByProject(List<WeeklyReport> reports) {
        return reports.stream()
                .filter(report -> report.getProject() != null)
                .collect(Collectors.groupingBy(
                        report -> report.getProject().getName(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));
    }

    private Map<String, Double> getTimeByTaskType(List<WeeklyReport> reports) {
        Map<String, Double> result = new LinkedHashMap<>();

        reports.forEach(report ->
                report.getTimeEntries().forEach(timeEntry ->
                        result.merge(
                                timeEntry.getTaskType().name(),
                                timeEntry.getHours(),
                                Double::sum
                        )
                )
        );

        return result;
    }

    private List<RecentActivityResponse> getRecentActivity() {
        return reviewRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toRecentActivity)
                .toList();
    }

    private RecentActivityResponse toRecentActivity(ReportReview review) {
        return new RecentActivityResponse(
                review.getReport().getId(),
                review.getReport().getUser().getName(),
                review.getAction().name(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}