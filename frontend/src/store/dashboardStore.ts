import { create } from "zustand";
import * as dashboardService from "../services/dashboardService";
import type { DashboardResponse } from "../types/dashboard";

interface DashboardState {

  dashboard: DashboardResponse | null;
  isLoading: boolean;
  error: string | null;
  
  fetchDashboard: (weekStartDate?: string) => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboard: null,
  isLoading: false,
  error: null,

  fetchDashboard: async (weekStartDate) => {
    set({ isLoading: true, error: null });

    try {
      const dashboard = await dashboardService.getDashboard(weekStartDate);
      set({ dashboard, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load dashboard.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null })
}));