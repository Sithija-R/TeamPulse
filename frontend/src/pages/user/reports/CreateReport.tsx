import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../components/common/PageHeader";
import { ReportForm } from "../../../components/reports/ReportForm";
import { useReportStore } from "../../../store/reportStore";
import type { WeeklyReportRequest } from "../../../types/report";

export const CreateReport = () => {
  const navigate = useNavigate();
  const { createReport } = useReportStore();

  const handleSubmit = async (reportPayload: WeeklyReportRequest) => {
    try {
      await createReport(reportPayload);
      navigate("/user/reports");
    } catch (error) {
      console.error("Failed to create report:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Weekly Status Report"
        description="Fill out your tasks, achievements, blockers, and time breakdown for the week."
      />
      <ReportForm onSubmit={handleSubmit} isEdit={false} />
    </div>
  );
};