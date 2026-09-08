import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../../components/common/PageHeader";
import { ReportForm } from "../../../components/reports/ReportForm";
import { CorrectionFeedback } from "../../../components/reports/CorrectionFeedback";
import { ErrorState } from "../../../components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useReportStore } from "../../../store/reportStore";
import { useReviewStore } from "../../../store/reviewStore";
import type { WeeklyReportRequest } from "../../../types/report";
import { toast } from "@/components/ui/toast";

export function EditReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reportId = Number(id);
  const [isSaving, setIsSaving] = useState(false);

  const {
    selectedReport,
    fetchMyReport,
    updateReport,
    submitReport,
    isLoading: reportLoading,
    error: reportError,
  } = useReportStore();

  const {
    reviews,
    fetchReviews,
    isLoading: reviewLoading,
    error: reviewError,
  } = useReviewStore();

  useEffect(() => {
    if (!id || Number.isNaN(reportId)) return;

    fetchMyReport(reportId);
    fetchReviews(reportId);
  }, [id, reportId, fetchMyReport, fetchReviews]);

  if (reportLoading && !selectedReport) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (reportError || !selectedReport) {
    return (
      <ErrorState
        title="Report Not Found"
        message={
          reportError || "The weekly report you requested could not be found."
        }
        onRetry={() => navigate("/user/reports")}
      />
    );
  }

  const report = selectedReport;
  const latestReview = reviews[0];

  const handleSubmit = async (reportPayload: WeeklyReportRequest, isSubmit: boolean) => {
    if (isSaving) return;
  
    setIsSaving(true);
  
    try {
      const updatedReport = await updateReport(reportId, reportPayload);
  
      if (isSubmit) {
        await submitReport(updatedReport.id);
  
        toast.add({
          title: "Report Resubmitted",
          description: "Your report has been updated and resubmitted successfully.",
          type: "success",
        });
      } else {
        toast.add({
          title: "Report Updated",
          description: "Your report has been updated successfully.",
          type: "success",
        });
      }
  
      navigate("/user/reports");
    } catch (error) {
      console.error("Failed to update report:", error);
  
      toast.add({
        title: isSubmit ? "Resubmission Failed" : "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Report`}
         description={`Report for Project ${report.projectName} - Week of ${report.weekStartDate}`}
      />

      {report.status === "NEEDS_CORRECTION" && (
        <CorrectionFeedback review={latestReview} />
      )}

      <ReportForm
        initialReport={report}
        onSubmit={handleSubmit}
        isEdit={true}
      />
    </div>
  );
}
