import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckSquare, FileText, History, MessageSquare } from "lucide-react";

import { PageHeader } from "../../../components/common/PageHeader";
import { ReportSummary } from "../../../components/reports/ReportSummary";
import { ReviewHistory } from "../../../components/reports/ReviewHistory";
import { VersionHistory } from "../../../components/reports/VersionHistory";
import { ErrorState } from "../../../components/common/ErrorState";
import { useReportStore } from "../../../store/reportStore";
import { useReviewStore } from "../../../store/reviewStore";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = "details" | "reviews" | "versions";

export function ManagementReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const reportId = Number(id);

  const {
    selectedReport,
    fetchReportById,
    isLoading: reportLoading,
    error: reportError,
  } = useReportStore();

  const { reviews, versions, fetchReviews, fetchVersions } = useReviewStore();

  useEffect(() => {
    if (!id || Number.isNaN(reportId)) return;
    fetchReportById(reportId);
    fetchReviews(reportId);
    fetchVersions(reportId);
  }, [id, reportId, fetchReportById, fetchReviews, fetchVersions]);

  if (reportLoading && !selectedReport) {
    return (
      <div className="space-y-6">
        <PageHeader title="Report Detail" description="Loading team report..." />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (reportError || !selectedReport) {
    return (
      <ErrorState
        title="Report Not Found"
        message={reportError || "The requested team report could not be found."}
        onRetry={() => navigate("/management/reports")}
      />
    );
  }

  const report = selectedReport;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Report Detail: ${report.userName}`}
        description={`${report.projectName} • ${report.userName} • Week of ${report.weekStartDate}`}
        breadcrumbs={[
          { label: "All Reports", href: "/management/reports" },
          { label: `Report #${report.id}` },
        ]}
        action={
          report.status === "SUBMITTED" ? (
            <Button
              render={<Link to={`/management/reports/${report.id}/review`} />}
              className="rounded-xl bg-[#8DF688] px-4 py-2 text-xs font-bold text-[#171A18] shadow-xs hover:bg-[#7ae875]"
            >
              <CheckSquare className="h-4 w-4" />
              Review / Update Decision
            </Button>
          ) : undefined
        }
      />

      <div className="flex overflow-x-auto border-b border-[#E5E7E5]">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("details")}
          className={`h-auto shrink-0 rounded-none border-b-2 px-4 py-3 text-xs font-semibold ${
            activeTab === "details"
              ? "border-b-[#171A18] font-bold text-[#171A18]"
              : "border-transparent text-[#6B726D] hover:bg-transparent hover:text-[#171A18]"
          }`}
        >
          <FileText className="h-4 w-4" />
          Report Summary
        </Button>

        <Button
          variant="ghost"
          onClick={() => setActiveTab("reviews")}
          className={`h-auto shrink-0 rounded-none border-b-2 px-4 py-3 text-xs font-semibold ${
            activeTab === "reviews"
              ? "border-b-[#171A18] font-bold text-[#171A18]"
              : "border-transparent text-[#6B726D] hover:bg-transparent hover:text-[#171A18]"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Review History ({reviews.length})
        </Button>

        <Button
          variant="ghost"
          onClick={() => setActiveTab("versions")}
          className={`h-auto shrink-0 rounded-none border-b-2 px-4 py-3 text-xs font-semibold ${
            activeTab === "versions"
              ? "border-b-[#171A18] font-bold text-[#171A18]"
              : "border-transparent text-[#6B726D] hover:bg-transparent hover:text-[#171A18]"
          }`}
        >
          <History className="h-4 w-4" />
          Version Audit History ({versions.length})
        </Button>
      </div>

      {activeTab === "details" && <ReportSummary report={report} />}
      {activeTab === "reviews" && <ReviewHistory reviews={reviews} />}
      {activeTab === "versions" && <VersionHistory versions={versions} />}
    </div>
  );
}