import { useState, useCallback, useSyncExternalStore } from 'react';
import { WeeklyReport, ReportStatus } from '../types/report';
import { ReportReview, ReportVersion } from '../types/review';
import { DUMMY_REPORTS, DUMMY_REVIEWS, DUMMY_VERSIONS } from '../lib/dummyData';

// Global reports state store
type Listener = () => void;

class ReportsStore {
  private reports: WeeklyReport[] = [...DUMMY_REPORTS];
  private reviews: Record<number, ReportReview[]> = { ...DUMMY_REVIEWS };
  private versions: Record<number, ReportVersion[]> = { ...DUMMY_VERSIONS };
  private listeners: Set<Listener> = new Set();

  getReports(): WeeklyReport[] {
    return this.reports;
  }

  getReportById(id: number): WeeklyReport | undefined {
    return this.reports.find((r) => r.id === id);
  }

  getReviewsForReport(reportId: number): ReportReview[] {
    return this.reviews[reportId] || [];
  }

  getVersionsForReport(reportId: number): ReportVersion[] {
    return this.versions[reportId] || [];
  }

  addReport(reportData: Omit<WeeklyReport, 'id'>): WeeklyReport {
    const newId = Date.now();
    const newReport: WeeklyReport = {
      ...reportData,
      id: newId,
    };
    this.reports.unshift(newReport);
    
    // Create initial version snapshot if submitted
    this.versions[newId] = [
      {
        id: Date.now(),
        versionNumber: 1,
        createdAt: new Date().toISOString(),
        submittedBy: reportData.userName,
        contentSnapshot: JSON.stringify(newReport),
      },
    ];

    this.notify();
    return newReport;
  }

  updateReport(id: number, updatedFields: Partial<WeeklyReport>): WeeklyReport | undefined {
    const index = this.reports.findIndex((r) => r.id === id);
    if (index === -1) return undefined;

    const updatedReport = {
      ...this.reports[index],
      ...updatedFields,
    };
    this.reports[index] = updatedReport;
    this.notify();
    return updatedReport;
  }

  submitReport(id: number): WeeklyReport | undefined {
    const report = this.getReportById(id);
    if (!report) return undefined;

    const existingVersions = this.versions[id] || [];
    const newVersionNum = existingVersions.length + 1;
    const submittedAt = new Date().toISOString();

    const updated = this.updateReport(id, {
      status: 'SUBMITTED',
      submittedAt,
    });

    if (updated) {
      this.versions[id] = [
        ...existingVersions,
        {
          id: Date.now(),
          versionNumber: newVersionNum,
          createdAt: submittedAt,
          submittedBy: report.userName,
          contentSnapshot: JSON.stringify(updated),
        },
      ];
    }

    this.notify();
    return updated;
  }

  reviewReport(
    reportId: number,
    managerId: number,
    managerName: string,
    action: 'APPROVED' | 'REQUESTED_CHANGES',
    comment: string
  ) {
    const report = this.getReportById(reportId);
    if (!report) return;

    const existingReviews = this.reviews[reportId] || [];
    const versions = this.versions[reportId] || [];
    const currentVersionNum = versions.length || 1;

    const newReview: ReportReview = {
      id: Date.now(),
      managerId,
      managerName,
      versionNumber: currentVersionNum,
      action,
      comment,
      createdAt: new Date().toISOString(),
    };

    this.reviews[reportId] = [newReview, ...existingReviews];

    const newStatus: ReportStatus = action === 'APPROVED' ? 'APPROVED' : 'NEEDS_CORRECTION';
    const approvedAt = action === 'APPROVED' ? new Date().toISOString() : null;

    this.updateReport(reportId, {
      status: newStatus,
      approvedAt,
    });

    this.notify();
  }

  deleteReport(id: number): boolean {
    this.reports = this.reports.filter((r) => r.id !== id);
    delete this.reviews[id];
    delete this.versions[id];
    this.notify();
    return true;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const reportsStore = new ReportsStore();

export function useReports() {
  const reports = useSyncExternalStore(
    (listener) => reportsStore.subscribe(listener),
    () => reportsStore.getReports()
  );

  const getReportById = useCallback((id: number) => {
    return reportsStore.getReportById(id);
  }, []);

  const getReviews = useCallback((reportId: number) => {
    return reportsStore.getReviewsForReport(reportId);
  }, []);

  const getVersions = useCallback((reportId: number) => {
    return reportsStore.getVersionsForReport(reportId);
  }, []);

  return {
    reports,
    getReportById,
    getReviews,
    getVersions,
    addReport: (report: Omit<WeeklyReport, 'id'>) => reportsStore.addReport(report),
    updateReport: (id: number, fields: Partial<WeeklyReport>) => reportsStore.updateReport(id, fields),
    submitReport: (id: number) => reportsStore.submitReport(id),
    reviewReport: (
      reportId: number,
      managerId: number,
      managerName: string,
      action: 'APPROVED' | 'REQUESTED_CHANGES',
      comment: string
    ) => reportsStore.reviewReport(reportId, managerId, managerName, action, comment),
    deleteReport: (id: number) => reportsStore.deleteReport(id),
  };
}
