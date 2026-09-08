import api from "../lib/api";
import type { WeeklyReport, WeeklyReportRequest, ReportStatus } from "../types/report";

export interface ReportFilters {
  memberId?: number;
  projectId?: number;
  status?: ReportStatus;
  startDate?: string;
  endDate?: string;
}

export const createReport = async (data: WeeklyReportRequest): Promise<WeeklyReport> => {
  const response = await api.post<WeeklyReport>("/reports", data);
  return response.data;
};

export const getMyReports = async (): Promise<WeeklyReport[]> => {
  const response = await api.get<WeeklyReport[]>("/reports/my");
  return response.data;
};

export const getMyReport = async (id: number): Promise<WeeklyReport> => {
  const response = await api.get<WeeklyReport>(`/reports/${id}`);
  return response.data;
};

export const getReportById = async (id: number): Promise<WeeklyReport> => {
  const response = await api.get<WeeklyReport>(`/reports/admin/${id}`);
  return response.data;
}

export const updateReport = async (id: number, data: WeeklyReportRequest): Promise<WeeklyReport> => {
  const response = await api.put<WeeklyReport>(`/reports/${id}`, data);
  return response.data;
};

export const deleteReport = async (id: number): Promise<void> => {
  await api.delete(`/reports/${id}`);
};

export const submitReport = async (id: number): Promise<WeeklyReport> => {
  const response = await api.post<WeeklyReport>(`/reports/${id}/submit`);
  return response.data;
};

export const getAllReports = async (filters?: ReportFilters): Promise<WeeklyReport[]> => {
  const response = await api.get<WeeklyReport[]>("/reports", {
    params: filters
  });
  return response.data;
};