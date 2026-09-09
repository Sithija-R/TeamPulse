package com.teampulse.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teampulse.backend.dto.AchievementRequest;
import com.teampulse.backend.dto.AchievementResponse;
import com.teampulse.backend.dto.BlockerRequest;
import com.teampulse.backend.dto.BlockerResponse;
import com.teampulse.backend.dto.ReportTaskRequest;
import com.teampulse.backend.dto.ReportTaskResponse;
import com.teampulse.backend.dto.TimeEntryRequest;
import com.teampulse.backend.dto.TimeEntryResponse;
import com.teampulse.backend.dto.WeeklyReportRequest;
import com.teampulse.backend.dto.WeeklyReportResponse;
import com.teampulse.backend.exception.OperationFailedException;
import com.teampulse.backend.exception.OperationNotAllowedException;
import com.teampulse.backend.exception.ResourceNotFoundException;
import com.teampulse.backend.exception.ResourceOverlappingException;
import com.teampulse.backend.model.Achievement;
import com.teampulse.backend.model.Blocker;
import com.teampulse.backend.model.Project;
import com.teampulse.backend.model.ReportTask;
import com.teampulse.backend.model.ReportVersion;
import com.teampulse.backend.model.TimeEntry;
import com.teampulse.backend.model.User;
import com.teampulse.backend.model.WeeklyReport;
import com.teampulse.backend.model.enums.ReportStatus;
import com.teampulse.backend.repository.ProjectRepository;
import com.teampulse.backend.repository.ReportVersionRepository;
import com.teampulse.backend.repository.WeeklyReportRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklyReportService {

        private final WeeklyReportRepository reportRepository;
        private final UserService userService;
        private final ProjectRepository projectRepository;
        private final ReportVersionRepository reportVersionRepository;
        private final ObjectMapper objectMapper;

        public WeeklyReportResponse createReport(WeeklyReportRequest request, String email) {

                User user = userService.getUserByEmail(email);

                if (reportRepository.existsByUserIdAndWeekStartDate(user.getId(), request.weekStartDate())) {

                        throw new ResourceOverlappingException("Report already exists for this week");
                }

                Project project = projectRepository.findById(request.projectId())
                                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

                WeeklyReport report = WeeklyReport.builder()
                                .user(user)
                                .project(project)
                                .weekStartDate(request.weekStartDate())
                                .weekEndDate(request.weekEndDate())
                                .status(ReportStatus.DRAFT)
                                .nextWeekTasks(request.nextWeekTasks())
                                .notes(request.notes())
                                .build();

                // Tasks
                if (request.tasks() != null) {

                        for (ReportTaskRequest taskRequest : request.tasks()) {

                                ReportTask task = ReportTask.builder()
                                                .report(report)
                                                .taskName(taskRequest.taskName())
                                                .priority(taskRequest.priority())
                                                .plannedPercentage(taskRequest.plannedPercentage())
                                                .actualPercentage(taskRequest.actualPercentage())
                                                .status(taskRequest.status())
                                                .plannedHours(taskRequest.plannedHours())
                                                .actualHours(taskRequest.actualHours())
                                                .deliverable(taskRequest.deliverable())
                                                .build();

                                report.getTasks().add(task);
                        }
                }

                // Blockers
                if (request.blockers() != null) {

                        for (BlockerRequest blockerRequest : request.blockers()) {

                                Blocker blocker = Blocker.builder()
                                                .report(report)
                                                .description(blockerRequest.description())
                                                .keyIssue(blockerRequest.keyIssue())
                                                .resolved(blockerRequest.resolved())
                                                .build();

                                report.getBlockers().add(blocker);
                        }
                }

                // Achievements
                if (request.achievements() != null) {

                        for (AchievementRequest achievementRequest : request.achievements()) {

                                Achievement achievement = Achievement.builder()
                                                .report(report)
                                                .description(achievementRequest.description())
                                                .keyAchievement(achievementRequest.keyAchievement())
                                                .build();

                                report.getAchievements().add(achievement);
                        }
                }

                // Time entries
                if (request.timeEntries() != null) {

                        for (TimeEntryRequest timeEntryRequest : request.timeEntries()) {

                                TimeEntry timeEntry = TimeEntry.builder()
                                                .report(report)
                                                .taskType(timeEntryRequest.taskType())
                                                .hours(timeEntryRequest.hours())
                                                .build();

                                report.getTimeEntries().add(timeEntry);
                        }
                }

                WeeklyReport savedReport = reportRepository.save(report);

                return toResponse(savedReport);
        }

        public List<WeeklyReportResponse> getMyReports(String email) {

                User user = userService.getUserByEmail(email);

                return reportRepository.findByUserId(user.getId())
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        public WeeklyReportResponse getMyReport(Long id, String email) {

                User user = userService.getUserByEmail(email);

                WeeklyReport report = reportRepository.findByIdAndUserId(id, user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

                return toResponse(report);
        }

        public WeeklyReportResponse updateReport(Long id, WeeklyReportRequest request, String email) {

                User user = userService.getUserByEmail(email);

                WeeklyReport report = reportRepository.findByIdAndUserId(id, user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

                if (report.getStatus() != ReportStatus.DRAFT && report.getStatus() != ReportStatus.NEEDS_CORRECTION) {

                        throw new OperationNotAllowedException(
                                        "Only draft or correction reports can be edited");
                }

                Project project = projectRepository.findById(request.projectId())
                                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

                // Update main report details
                report.setProject(project);
                report.setWeekStartDate(request.weekStartDate());
                report.setWeekEndDate(request.weekEndDate());
                report.setNextWeekTasks(request.nextWeekTasks());
                report.setNotes(request.notes());

                report.getTasks().clear();

                if (request.tasks() != null) {
                        for (ReportTaskRequest taskRequest : request.tasks()) {

                                ReportTask task = ReportTask.builder()
                                                .report(report)
                                                .taskName(taskRequest.taskName())
                                                .priority(taskRequest.priority())
                                                .plannedPercentage(taskRequest.plannedPercentage())
                                                .actualPercentage(taskRequest.actualPercentage())
                                                .status(taskRequest.status())
                                                .plannedHours(taskRequest.plannedHours())
                                                .actualHours(taskRequest.actualHours())
                                                .deliverable(taskRequest.deliverable())
                                                .build();

                                report.getTasks().add(task);
                        }
                }

                report.getBlockers().clear();

                if (request.blockers() != null) {
                        for (BlockerRequest blockerRequest : request.blockers()) {

                                Blocker blocker = Blocker.builder()
                                                .report(report)
                                                .description(blockerRequest.description())
                                                .keyIssue(blockerRequest.keyIssue())
                                                .resolved(blockerRequest.resolved())
                                                .build();

                                report.getBlockers().add(blocker);
                        }
                }

                report.getAchievements().clear();

                if (request.achievements() != null) {
                        for (AchievementRequest achievementRequest : request.achievements()) {

                                Achievement achievement = Achievement.builder()
                                                .report(report)
                                                .description(achievementRequest.description())
                                                .keyAchievement(
                                                                achievementRequest.keyAchievement())
                                                .build();

                                report.getAchievements().add(achievement);
                        }
                }

                report.getTimeEntries().clear();

                if (request.timeEntries() != null) {
                        for (TimeEntryRequest timeEntryRequest : request.timeEntries()) {

                                TimeEntry timeEntry = TimeEntry.builder()
                                                .report(report)
                                                .taskType(timeEntryRequest.taskType())
                                                .hours(timeEntryRequest.hours())
                                                .build();

                                report.getTimeEntries().add(timeEntry);
                        }
                }

                WeeklyReport updatedReport = reportRepository.save(report);

                return toResponse(updatedReport);
        }

        public WeeklyReportResponse getReportById(Long id) {
                return reportRepository.findById(id)
                                .map(this::toResponse)
                                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        }

        public void deleteReport(Long id, String email) {

                User user = userService.getUserByEmail(email);

                WeeklyReport report = reportRepository.findByIdAndUserId(id, user.getId())
                                .orElseThrow(() -> new RuntimeException("Report not found"));

                if (report.getStatus() != ReportStatus.DRAFT) {
                        throw new OperationNotAllowedException("Only draft reports can be deleted");
                }

                reportRepository.delete(report);
        }

        @Transactional
        public WeeklyReportResponse submitReport(Long id, String email) {
                User user = userService.getUserByEmail(email);

                WeeklyReport report = reportRepository.findByIdAndUserId(id, user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

                if (report.getStatus() != ReportStatus.DRAFT && report.getStatus() != ReportStatus.NEEDS_CORRECTION) {
                        throw new OperationNotAllowedException("Only draft or correction reports can be submitted");
                }

                report.setStatus(ReportStatus.SUBMITTED);
                report.setSubmittedAt(LocalDateTime.now());

                WeeklyReport savedReport = reportRepository.save(report);

                createReportVersion(savedReport);

                return toResponse(savedReport);
        }

        private ReportVersion createReportVersion(WeeklyReport report) {
                try {
                        Integer nextVersion = reportVersionRepository
                                        .findTopByReportIdOrderByVersionNumberDesc(report.getId())
                                        .map(version -> version.getVersionNumber() + 1)
                                        .orElse(1);

                        String snapshot = objectMapper.writeValueAsString(toResponse(report));

                        ReportVersion version = ReportVersion.builder()
                                        .report(report)
                                        .versionNumber(nextVersion)
                                        .contentSnapshot(snapshot)
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        return reportVersionRepository.save(version);
                } catch (JsonProcessingException e) {
                        throw new OperationFailedException("Failed to create report version: " + e.getMessage());

                }
        }

        @Transactional(readOnly = true)
        public List<WeeklyReportResponse> getFilteredReports(Long memberId, Long projectId, ReportStatus status,
                        LocalDate startDate, LocalDate endDate) {

                
                Specification<WeeklyReport> specification = Specification
                                .where((root, query, cb) -> cb.notEqual(root.get("status"), ReportStatus.DRAFT));

                if (memberId != null) {
                        specification = specification
                                        .and((root, query, cb) -> cb.equal(root.get("user").get("id"), memberId));
                }

                if (projectId != null) {
                        specification = specification
                                        .and((root, query, cb) -> cb.equal(root.get("project").get("id"), projectId));
                }

                if (status != null) {
                        specification = specification.and((root, query, cb) -> cb.equal(root.get("status"), status));
                }

                if (startDate != null) {
                        specification = specification.and((root, query, cb) -> cb
                                        .greaterThanOrEqualTo(root.get("weekStartDate"), startDate));
                }

                if (endDate != null) {
                        specification = specification.and(
                                        (root, query, cb) -> cb.lessThanOrEqualTo(root.get("weekEndDate"), endDate));
                }

                return reportRepository.findAll(specification)
                                .stream()
                                .map(this::toResponse)
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
                                report.getTasks().stream().map(task -> new ReportTaskResponse(
                                                task.getId(),
                                                task.getTaskName(),
                                                task.getPriority(),
                                                task.getPlannedPercentage(),
                                                task.getActualPercentage(),
                                                task.getStatus(),
                                                task.getPlannedHours(),
                                                task.getActualHours(),
                                                task.getDeliverable())).toList(),
                                report.getBlockers().stream().map(blocker -> new BlockerResponse(
                                                blocker.getId(),
                                                blocker.getDescription(),
                                                blocker.isKeyIssue(),
                                                blocker.isResolved())).toList(),
                                report.getAchievements().stream().map(achievement -> new AchievementResponse(
                                                achievement.getId(),
                                                achievement.getDescription(),
                                                achievement.isKeyAchievement())).toList(),
                                report.getTimeEntries().stream().map(timeEntry -> new TimeEntryResponse(
                                                timeEntry.getId(),
                                                timeEntry.getTaskType(),
                                                timeEntry.getHours())).toList());
        }

}