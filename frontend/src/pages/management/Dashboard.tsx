import { useEffect } from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { DashboardMetrics } from "../../components/dashboard/DashboardMetrics";
import { StatusOverview } from "../../components/dashboard/StatusOverview";
import { MemberStatusChart } from "../../components/dashboard/MemberStatusChart";
import { ProjectDistributionChart } from "../../components/dashboard/ProjectDistributionChart";
import { TimeDistributionChart } from "../../components/dashboard/TimeDistributionChart";
import { RecentActivity } from "../../components/dashboard/RecentActivity";
import { CURRENT_WEEK } from "../../lib/constants";
import { useDashboardStore } from "../../store/dashboardStore";

export function ManagementDashboard() {
  const { dashboard, isLoading, error, fetchDashboard } = useDashboardStore();
  console.log("Dashboard data:", dashboard);
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading && !dashboard) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Management Executive Dashboard"
          description={`Team overview, reporting compliance, and sprint pulse for ${CURRENT_WEEK.label}`}
        />
        <div className="text-sm text-[#6B726D]">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Management Executive Dashboard"
          description={`Team overview, reporting compliance, and sprint pulse for ${CURRENT_WEEK.label}`}
        />
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Dashboard data is unavailable."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Management Executive Dashboard"
        description={`Team overview, reporting compliance, and sprint pulse for ${CURRENT_WEEK.label}`}
      />

      <DashboardMetrics metrics={dashboard} />

      <StatusOverview metrics={dashboard} />

      <MemberStatusChart statuses={dashboard.statusByMember} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProjectDistributionChart projects={dashboard.reportsByProject} />
        <TimeDistributionChart distribution={dashboard.timeByTaskType} />
      </div>

      <RecentActivity activities={dashboard.recentActivity} />
    </div>
  );
}
