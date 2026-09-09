import api from "../lib/api";
import type { DashboardResponse } from "../types/dashboard";

export const getDashboard = async (weekStartDate?: string): Promise<DashboardResponse> => {
  const response = await api.get<DashboardResponse>("/dashboard", {
    params: weekStartDate ? { weekStartDate } : undefined
  });
  return response.data;
};