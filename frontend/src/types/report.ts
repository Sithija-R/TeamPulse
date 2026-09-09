export type ReportStatus = "DRAFT" | "SUBMITTED" | "NEEDS_CORRECTION" | "APPROVED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
export type TaskType = "DEVELOPMENT" | "TESTING" | "MEETINGS" | "DOCUMENTATION" | "RESEARCH" | "OTHER";

export interface ReportTask {
  id: number;
  taskName: string;
  priority: Priority;
  plannedPercentage: number;
  actualPercentage: number;
  status: TaskStatus;
  plannedHours: number | null;
  actualHours: number | null;
  deliverable: string | null;
}

export interface Blocker {
  id: number;
  description: string;
  keyIssue: boolean;
  resolved: boolean;
}

export interface Achievement {
  id: number;
  description: string;
  keyAchievement: boolean;
}

export interface TimeEntry {
  id: number;
  taskType: TaskType;
  hours: number;
}

export interface ReportTaskRequest {
  taskName: string;
  priority: Priority;
  plannedPercentage: number;
  actualPercentage: number;
  status: TaskStatus;
  plannedHours?: number;
  actualHours?: number;
  deliverable?: string;
}

export interface BlockerRequest {
  description: string;
  keyIssue: boolean;
  resolved: boolean;
}

export interface AchievementRequest {
  description: string;
  keyAchievement: boolean;
}

export interface TimeEntryRequest {
  taskType: TaskType;
  hours: number;
}

export interface WeeklyReportRequest {
  projectId: number;
  weekStartDate: string;
  weekEndDate: string;
  nextWeekTasks?: string;
  notes?: string;
  tasks: ReportTaskRequest[];
  blockers: BlockerRequest[];
  achievements: AchievementRequest[];
  timeEntries: TimeEntryRequest[];
}

export interface WeeklyReport {
  id: number;
  userId: number;
  userName: string;
  projectId: number;
  projectName: string;
  weekStartDate: string;
  weekEndDate: string;
  status: ReportStatus;
  nextWeekTasks: string | null;
  notes: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  tasks: ReportTask[];
  blockers: Blocker[];
  achievements: Achievement[];
  timeEntries: TimeEntry[];
}