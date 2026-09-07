import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Edit, History, FileText, MessageSquare } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { ReportSummary } from "../../../components/reports/ReportSummary";
import { ReviewHistory } from "../../../components/reports/ReviewHistory";
import { VersionHistory } from "../../../components/reports/VersionHistory";
import { CorrectionFeedback } from "../../../components/reports/CorrectionFeedback";
import { ErrorState } from "../../../components/common/ErrorState";
import { useReportStore } from "../../../store/reportStore";
import { useReviewStore } from "../../../store/reviewStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "details" | "reviews" | "versions"
  >("details");
  const reportId = Number(id);

  const {
    selectedReport,
    fetchMyReport,
    isLoading: reportLoading,
    error: reportError,
  } = useReportStore();

  const { reviews, versions, fetchReviews, fetchVersions } = useReviewStore();

  useEffect(() => {
    if (!id || Number.isNaN(reportId)) return;
    fetchMyReport(reportId);
    fetchReviews(reportId);
    fetchVersions(reportId);
  }, [id, reportId, fetchMyReport, fetchReviews, fetchVersions]);

  if (reportLoading && !selectedReport) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (reportError || !selectedReport) {
    return (
      <ErrorState
        title="Report Not Found"
        message={reportError || "The weekly report could not be found."}
        onRetry={() => navigate("/user/reports")}
      />
    );
  }

  const report = selectedReport;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Report"
        description={`${report.projectName} • Week of ${report.weekStartDate}`}
        breadcrumbs={[{ label: `Report ${report.id}` }]}
        action={
          (report.status === "DRAFT" ||
            report.status === "NEEDS_CORRECTION") && (
            <Button
              render={<Link to={`/user/reports/${report.id}/edit`} />}
              className={`rounded-xl px-4 text-xs font-bold shadow-xs text-[#171A18] ${
                report.status === "DRAFT"
                  ? "bg-[#8DF688]  hover:bg-[#7ae875]"
                  : "bg-amber-500  hover:bg-amber-600"
              }`}
            >
              <Edit className="h-4 w-4" />
              {report.status === "DRAFT"
                ? "Edit & Submit Report"
                : "Edit & Resubmit Report"}
            </Button>
          )
        }
      />

      {report.status === "NEEDS_CORRECTION" && reviews.length > 0 && (
        <CorrectionFeedback review={reviews[0]} />
      )}

      <div className="flex border-b border-[#E5E7E5] text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 transition-colors ${
            activeTab === "details"
              ? "border-[#171A18] font-bold text-[#171A18]"
              : "border-transparent text-[#6B726D] hover:text-[#171A18]"
          }`}
        >
          <FileText className="h-4 w-4" />
          Report Summary
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 transition-colors ${
            activeTab === "reviews"
              ? "border-[#171A18] font-bold text-[#171A18]"
              : "border-transparent text-[#6B726D] hover:text-[#171A18]"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Review History ({reviews.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("versions")}
          className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 transition-colors ${
            activeTab === "versions"
              ? "border-[#171A18] font-bold text-[#171A18]"
              : "border-transparent text-[#6B726D] hover:text-[#171A18]"
          }`}
        >
          <History className="h-4 w-4" />
          Version History ({versions.length})
        </button>
      </div>

      {activeTab === "details" && <ReportSummary report={report} />}
      {activeTab === "reviews" && <ReviewHistory reviews={reviews} />}
      {activeTab === "versions" && <VersionHistory versions={versions} />}
    </div>
  );
}
