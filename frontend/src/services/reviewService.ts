import api from "../lib/api";
import type { ReportReview, ReviewRequest, ReportVersion } from "../types/review";
import type { WeeklyReport } from "../types/report";

export const reviewReport = async (id: number, data: ReviewRequest): Promise<WeeklyReport> => {
  const response = await api.post<WeeklyReport>(`/reports/${id}/review`, data);
  return response.data;
};

export const getReportReviews = async (id: number): Promise<ReportReview[]> => {
  const response = await api.get<ReportReview[]>(`/reports/${id}/reviews`);
  return response.data;
};

export const getReportVersions = async (id: number): Promise<ReportVersion[]> => {
  const response = await api.get<ReportVersion[]>(`/reports/${id}/versions`);
  return response.data;
};

export const getReportVersion = async (id: number, versionNumber: number): Promise<ReportVersion> => {
  const response = await api.get<ReportVersion>(`/reports/${id}/versions/${versionNumber}`);
  return response.data;
};