import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PageHeader } from "../../../components/common/PageHeader";
import { ReportForm } from "../../../components/reports/ReportForm";
import { useReportStore } from "../../../store/reportStore";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

import type { WeeklyReportRequest } from "../../../types/report";

function getCurrentWeekStart(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  return monday.toISOString().split("T")[0];
}

export function CreateReport() {
  const navigate = useNavigate();

  const { reports, isLoading, fetchMyReports, createReport } = useReportStore();

  useEffect(() => {
    fetchMyReports();
  }, [fetchMyReports]);

  const currentWeekStart = getCurrentWeekStart();

  const existingReport = reports.find(
    (report) => report.weekStartDate === currentWeekStart
  );

  const handleSubmit = async (reportPayload: WeeklyReportRequest) => {
    try {
      await createReport(reportPayload);

      toast.add({
        title: "Report Created",
        description: "Your weekly report has been created successfully.",
        type: "success",
      });

      navigate("/user/reports");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create the report. Please try again.";

      console.error("Failed to create report:", error);

      toast.add({
        title: "Report Creation Failed",
        description: message,
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Weekly Status Report"
        description="Fill out your tasks, achievements, blockers, and time breakdown for the week."
      />

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-sm text-[#6B726D]">
            Checking your weekly reports...
          </CardContent>
        </Card>
      ) : existingReport ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div>
              <h2 className="text-lg font-semibold text-[#171A18]">
                Weekly report already created
              </h2>

              <p className="mt-1 text-sm text-[#6B726D]">
                You have already created a report for the week starting{" "}
                {currentWeekStart}.
              </p>
            </div>

            <Button render={<Link to={`/user/reports/${existingReport.id}`} className="bg-[var(--primary)] hover:bg-[var(--primary)]/80"/>}>
              View Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ReportForm onSubmit={handleSubmit} isEdit={false} />
      )}
    </div>
  );
}
