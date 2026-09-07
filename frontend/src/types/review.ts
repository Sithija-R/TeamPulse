export type ReviewAction = "APPROVED" | "REQUESTED_CHANGES";

export interface ReviewRequest {
  action: ReviewAction;
  comment: string;
}

export interface ReportReview {
  id: number;
  managerId: number;
  managerName: string;
  versionNumber: number;
  action: ReviewAction;
  comment: string;
  createdAt: string;
}

export interface ReportVersion {
  id: number;
  versionNumber: number;
  createdAt: string;
  contentSnapshot: string;
}