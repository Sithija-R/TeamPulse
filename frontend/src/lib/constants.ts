import { Priority, ReportStatus, TaskStatus, TaskType } from '../types/report';

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  NEEDS_CORRECTION: 'Needs Correction',
  APPROVED: 'Approved',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  BLOCKED: 'Blocked',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  DEVELOPMENT: 'Development',
  TESTING: 'Testing',
  MEETINGS: 'Meetings',
  DOCUMENTATION: 'Documentation',
  RESEARCH: 'Research',
  OTHER: 'Other',
};

export const TASK_TYPES: TaskType[] = [
  'DEVELOPMENT',
  'TESTING',
  'MEETINGS',
  'DOCUMENTATION',
  'RESEARCH',
  'OTHER',
];

export const CURRENT_WEEK = {
  startDate: '2026-09-01',
  endDate: '2026-09-07',
  label: 'Week 36 (Sep 01 - Sep 07, 2026)',
};
