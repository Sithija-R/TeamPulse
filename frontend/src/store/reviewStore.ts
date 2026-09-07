import { create } from "zustand";
import * as reviewService from "../services/reviewService";
import type { ReportReview, ReportVersion, ReviewRequest } from "../types/review";
import type { WeeklyReport } from "../types/report";

interface ReviewState {
  reviews: ReportReview[];
  versions: ReportVersion[];
  isLoading: boolean;
  error: string | null;
  reviewReport: (id: number, data: ReviewRequest) => Promise<WeeklyReport>;
  fetchReviews: (id: number) => Promise<void>;
  fetchVersions: (id: number) => Promise<void>;
  fetchVersion: (id: number, versionNumber: number) => Promise<ReportVersion>;
  clearError: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  versions: [],
  isLoading: false,
  error: null,

  reviewReport: async (id, data) => {
    set({ isLoading: true, error: null });

    try {
      const report = await reviewService.reviewReport(id, data);
      set({ isLoading: false });
      return report;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to review report.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchReviews: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const reviews = await reviewService.getReportReviews(id);
      set({ reviews, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load review history.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchVersions: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const versions = await reviewService.getReportVersions(id);
      set({ versions, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load version history.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchVersion: async (id, versionNumber) => {
    set({ isLoading: true, error: null });

    try {
      const version = await reviewService.getReportVersion(id, versionNumber);
      set({ isLoading: false });
      return version;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load report version.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null })
}));