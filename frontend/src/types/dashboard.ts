export interface MemberStatus {
  memberId: number;
  memberName: string;
  status: string;
  reportCount: number;
}

export interface RecentActivity {
  reportId: number;
  memberName: string;
  action: string;
  comment: string;
  createdAt: string;
}

export interface DashboardResponse {
  totalReports: number;
  submittedThisWeek: number;
  complianceRate: number;
  draftCount: number;
  submittedCount: number;
  needsCorrectionCount: number;
  approvedCount: number;
  notStartedCount: number;
  openBlockers: number;
  statusByMember: MemberStatus[];
  reportsByProject: Record<string, number>;
  timeByTaskType: Record<string, number>;
  recentActivity: RecentActivity[];
}