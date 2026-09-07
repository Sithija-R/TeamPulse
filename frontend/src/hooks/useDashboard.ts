import { useMemo } from 'react';
import { useReports } from './useReports';
import { DUMMY_USERS, DUMMY_PROJECTS } from '../lib/dummyData';
import {
  DashboardMetrics,
  MemberSubmissionStatus,
  ProjectDistribution,
  TimeDistribution,
  ActivityItem,
} from '../types/dashboard';
import { TaskType } from '../types/report';

export function useDashboard() {
  const { reports } = useReports();

  const metrics: DashboardMetrics = useMemo(() => {
    const totalReports = reports.length;
    const currentWeekReports = reports.filter((r) => r.weekStartDate === '2026-09-01');
    const submittedThisWeek = currentWeekReports.filter((r) => r.status === 'SUBMITTED' || r.status === 'APPROVED').length;
    
    // Total team members expected to report
    const teamMembersCount = DUMMY_USERS.filter((u) => u.role === 'TEAM_MEMBER').length;
    const complianceRate = teamMembersCount > 0 ? Math.round((submittedThisWeek / teamMembersCount) * 100) : 0;

    const needsCorrection = reports.filter((r) => r.status === 'NEEDS_CORRECTION').length;
    
    let openBlockers = 0;
    reports.forEach((r) => {
      openBlockers += r.blockers.filter((b) => !b.resolved).length;
    });

    const draftCount = currentWeekReports.filter((r) => r.status === 'DRAFT').length;
    const submittedCount = currentWeekReports.filter((r) => r.status === 'SUBMITTED').length;
    const approvedCount = currentWeekReports.filter((r) => r.status === 'APPROVED').length;
    const notStartedCount = Math.max(0, teamMembersCount - currentWeekReports.length);

    return {
      totalReports,
      submittedThisWeek,
      complianceRate,
      needsCorrection,
      openBlockers,
      draftCount,
      submittedCount,
      approvedCount,
      notStartedCount,
    };
  }, [reports]);

  const memberStatuses: MemberSubmissionStatus[] = useMemo(() => {
    const teamMembers = DUMMY_USERS.filter((u) => u.role === 'TEAM_MEMBER');
    const currentWeekReports = reports.filter((r) => r.weekStartDate === '2026-09-01');

    return teamMembers.map((member) => {
      const userReport = currentWeekReports.find((r) => r.userId === member.id);
      const userProject = DUMMY_PROJECTS.find((p) => p.id === userReport?.projectId) || DUMMY_PROJECTS[0];
      const openBlockerCount = userReport ? userReport.blockers.filter((b) => !b.resolved).length : 0;

      return {
        userId: member.id,
        userName: member.name,
        email: member.email,
        role: member.department || 'Developer',
        projectName: userReport ? userReport.projectName : userProject.name,
        reportId: userReport?.id,
        status: userReport ? userReport.status : 'NOT_STARTED',
        lastUpdated: userReport?.submittedAt || userReport?.approvedAt || 'No submission',
        blockersCount: openBlockerCount,
      };
    });
  }, [reports]);

  const projectDistribution: ProjectDistribution[] = useMemo(() => {
    return DUMMY_PROJECTS.map((project) => {
      const projectReports = reports.filter((r) => r.projectId === project.id);
      let totalHours = 0;
      projectReports.forEach((r) => {
        r.timeEntries.forEach((t) => {
          totalHours += t.hours;
        });
      });

      const uniqueMembers = new Set(projectReports.map((r) => r.userId)).size;

      return {
        projectId: project.id,
        projectName: project.name,
        reportCount: projectReports.length,
        totalHours: totalHours || Math.floor(Math.random() * 40 + 20),
        memberCount: uniqueMembers || project.memberCount || 2,
      };
    });
  }, [reports]);

  const timeDistribution: TimeDistribution[] = useMemo(() => {
    const typeTotals: Record<TaskType, number> = {
      DEVELOPMENT: 0,
      TESTING: 0,
      MEETINGS: 0,
      DOCUMENTATION: 0,
      RESEARCH: 0,
      OTHER: 0,
    };

    let grandTotal = 0;

    reports.forEach((r) => {
      r.timeEntries.forEach((entry) => {
        typeTotals[entry.taskType] = (typeTotals[entry.taskType] || 0) + entry.hours;
        grandTotal += entry.hours;
      });
    });

    if (grandTotal === 0) grandTotal = 1;

    return (Object.keys(typeTotals) as TaskType[]).map((taskType) => ({
      taskType,
      hours: typeTotals[taskType],
      percentage: Math.round((typeTotals[taskType] / grandTotal) * 100),
    }));
  }, [reports]);

  const recentActivity: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [];

    reports.forEach((report) => {
      if (report.submittedAt) {
        items.push({
          id: `sub-${report.id}`,
          type: 'SUBMITTED',
          userName: report.userName,
          reportId: report.id,
          projectName: report.projectName,
          timestamp: report.submittedAt,
          details: `Submitted report for week starting ${report.weekStartDate}`,
        });
      }
      if (report.approvedAt) {
        items.push({
          id: `app-${report.id}`,
          type: 'APPROVED',
          userName: 'Sarah Chen (Manager)',
          reportId: report.id,
          projectName: report.projectName,
          timestamp: report.approvedAt,
          details: `Approved report submitted by ${report.userName}`,
        });
      }
      if (report.status === 'NEEDS_CORRECTION') {
        items.push({
          id: `cor-${report.id}`,
          type: 'CHANGES_REQUESTED',
          userName: 'Sarah Chen (Manager)',
          reportId: report.id,
          projectName: report.projectName,
          timestamp: report.submittedAt || new Date().toISOString(),
          details: `Requested changes on ${report.userName}'s report`,
        });
      }
      report.blockers.forEach((blocker) => {
        if (blocker.keyIssue) {
          items.push({
            id: `blk-${blocker.id}`,
            type: 'BLOCKER_ADDED',
            userName: report.userName,
            reportId: report.id,
            projectName: report.projectName,
            timestamp: report.submittedAt || '2026-09-05T12:00:00Z',
            details: `Flagged key blocker: "${blocker.description.slice(0, 50)}..."`,
          });
        }
      });
    });

    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
  }, [reports]);

  return {
    metrics,
    memberStatuses,
    projectDistribution,
    timeDistribution,
    recentActivity,
  };
}
