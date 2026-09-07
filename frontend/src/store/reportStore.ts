import { create } from "zustand";
import * as reportService from "../services/reportService";
import type { ReportFilters } from "../services/reportService";
import type { WeeklyReport } from "../types/report";

interface ReportState {
    
  reports: WeeklyReport[];
  selectedReport: WeeklyReport | null;
  isLoading: boolean;
  error: string | null;

  fetchMyReports: () => Promise<void>;
  fetchMyReport: (id: number) => Promise<void>;
  fetchAllReports: (filters?: ReportFilters) => Promise<void>;
  createReport: (data: Parameters<typeof reportService.createReport>[0]) => Promise<WeeklyReport>;
  updateReport: (id: number, data: Parameters<typeof reportService.updateReport>[1]) => Promise<WeeklyReport>;
  deleteReport: (id: number) => Promise<void>;
  submitReport: (id: number) => Promise<WeeklyReport>;
  clearSelectedReport: () => void;
  clearError: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  selectedReport: null,
  isLoading: false,
  error: null,

  fetchMyReports: async () => {
    set({ isLoading: true, error: null });

    try {
      const reports = await reportService.getMyReports();
      set({ reports, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load reports.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchMyReport: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const selectedReport = await reportService.getMyReport(id);
      set({ selectedReport, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load report.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchAllReports: async (filters) => {
    set({ isLoading: true, error: null });

    try {
      const reports = await reportService.getAllReports(filters);
      set({ reports, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load reports.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  createReport: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const report = await reportService.createReport(data);

      set((state) => ({
        reports: [report, ...state.reports],
        selectedReport: report,
        isLoading: false
      }));

      return report;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create report.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  updateReport: async (id, data) => {
    set({ isLoading: true, error: null });

    try {
      const report = await reportService.updateReport(id, data);

      set((state) => ({
        reports: state.reports.map((item) => item.id === id ? report : item),
        selectedReport: report,
        isLoading: false
      }));

      return report;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update report.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  deleteReport: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await reportService.deleteReport(id);

      set((state) => ({
        reports: state.reports.filter((report) => report.id !== id),
        selectedReport: state.selectedReport?.id === id ? null : state.selectedReport,
        isLoading: false
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete report.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  submitReport: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const report = await reportService.submitReport(id);

      set((state) => ({
        reports: state.reports.map((item) => item.id === id ? report : item),
        selectedReport: report,
        isLoading: false
      }));

      return report;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to submit report.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  clearSelectedReport: () => set({ selectedReport: null }),
  clearError: () => set({ error: null })
}));