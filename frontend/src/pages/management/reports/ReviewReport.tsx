import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, MessageSquare } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { ReportSummary } from "../../../components/reports/ReportSummary";
import { ReviewHistory } from "../../../components/reports/ReviewHistory";
import { VersionHistory } from "../../../components/reports/VersionHistory";
import { ErrorState } from "../../../components/common/ErrorState";
import { useAuthStore } from "../../../store/authStore";
import { useReportStore } from "../../../store/reportStore";
import { useReviewStore } from "../../../store/reviewStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ReviewRequest } from "../../../types/review";
import { toast } from "@/components/ui/toast";

export const ReviewReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    reports,
    fetchAllReports,
    isLoading: reportsLoading,
  } = useReportStore();
  const {
    reviews,
    versions,
    fetchReviews,
    fetchVersions,
    reviewReport,
    isLoading: reviewLoading,
    error,
    clearError,
  } = useReviewStore();

  const [comment, setComment] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const reportId = Number(id);
  const report = reports.find((item) => item.id === reportId);

  useEffect(() => {
    if (!id || Number.isNaN(reportId)) return;

    fetchAllReports();
    fetchReviews(reportId);
    fetchVersions(reportId);

    return () => clearError();
  }, [id, reportId, fetchAllReports, fetchReviews, fetchVersions, clearError]);

  const handleReviewAction = async (
    action: "APPROVED" | "REQUESTED_CHANGES"
  ) => {
    if (action === "REQUESTED_CHANGES" && !comment.trim()) {
      return;
    }

    const request: ReviewRequest = {
      action,
      comment:
        comment.trim() ||
        (action === "APPROVED" ? "Approved by manager." : "Changes requested."),
    };

    try {
      await reviewReport(reportId, request);

      toast.add({
        title:
          request.action === "APPROVED"
            ? "Report Approved"
            : "Changes Requested",
        description:
          request.action === "APPROVED"
            ? "The report has been approved successfully."
            : "The report has been returned to the team member for corrections.",
        type: "success",
      });

      navigate("/management/reports");
    } catch (error) {
      toast.add({
        title: "Review Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to review the report.",
        type: "error",
      });
    }
  };

  if (reportsLoading && !report) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <ErrorState
        title="Report Not Found"
        message="The report you want to review does not exist."
        onRetry={() => navigate("/management/reports")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Review Report`}
        description={`${report.projectName} • ${report.userName} • Week of ${report.weekStartDate}`}
        breadcrumbs={[
          { label: "All Reports", href: "/management/reports" },
          {
            label: `Report ${report.id}`,
            href: `/management/reports/${report.id}`,
          },
        ]}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowHistory((value) => !value)}
            className="rounded-lg border-[#E5E7E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
          >
            {showHistory ? "Hide Audit Logs" : "View Audit & Review Logs"}
          </Button>
        }
      />

      {showHistory && (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-150 lg:grid-cols-2">
          <ReviewHistory reviews={reviews} />
          <VersionHistory versions={versions} />
        </div>
      )}

      <ReportSummary report={report} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="sticky bottom-4 z-20 border-[#171A18] bg-white shadow-2xl">
        <CardHeader className="border-b border-[#E5E7E5] pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-[#171A18]">
            <MessageSquare className="h-4 w-4" />
            Manager Review & Approval Decision
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          <div className="space-y-1.5">
            <label
              htmlFor="review-comment"
              className="text-xs font-semibold text-[#171A18]"
            >
              Review Comments / Feedback Instructions *
            </label>

            <Textarea
              id="review-comment"
              rows={3}
              value={comment}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setComment(e.target.value)
              }
              placeholder="Add praise, notes on deliverable quality, or specific change requests for the engineer..."
              className="resize-none rounded-xl border-[#E5E7E5] bg-[#F7F8F7] text-xs leading-relaxed text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-[#6B726D]">
              Reviewing as{" "}
              <strong className="text-[#171A18]">
                {authUser?.name ?? "Unknown User"}
              </strong>{" "}
              ({authUser?.role ?? "UNKNOWN"})
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={reviewLoading}
                onClick={() => handleReviewAction("REQUESTED_CHANGES")}
                className="gap-1.5 rounded-xl border-amber-300 bg-amber-50 px-4 text-xs font-bold text-amber-900 hover:bg-amber-100"
              >
                <AlertCircle className="h-4 w-4 text-amber-700" />
                Request Changes
              </Button>

              <Button
                type="button"
                disabled={reviewLoading}
                onClick={() => handleReviewAction("APPROVED")}
                className="gap-1.5 rounded-xl bg-[#8DF688] px-5 text-xs font-bold text-[#171A18] shadow-xs hover:bg-[#7ae875]"
              >
                <CheckCircle2 className="h-4 w-4" />
                {reviewLoading ? "Processing..." : "Approve Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
