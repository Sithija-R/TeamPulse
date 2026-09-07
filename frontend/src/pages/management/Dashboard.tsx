import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardMetrics } from '../../components/dashboard/DashboardMetrics';
import { StatusOverview } from '../../components/dashboard/StatusOverview';
import { MemberStatusChart } from '../../components/dashboard/MemberStatusChart';
import { ProjectDistributionChart } from '../../components/dashboard/ProjectDistributionChart';
import { TimeDistributionChart } from '../../components/dashboard/TimeDistributionChart';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { CURRENT_WEEK } from '../../lib/constants';

export const ManagementDashboard: React.FC = () => {
  const { metrics, memberStatuses, projectDistribution, timeDistribution, recentActivity } =
    useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Management Executive Dashboard"
        description={`Team overview, reporting compliance, and sprint pulse for ${CURRENT_WEEK.label}`}
      />

      {/* Top Key Metrics Row */}
      <DashboardMetrics metrics={metrics} isManager={true} />

      {/* Status Breakdown Bar */}
      <StatusOverview metrics={metrics} />

      {/* Member Submission Status Table */}
      <MemberStatusChart statuses={memberStatuses} />

      {/* Two Column Grid for Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProjectDistributionChart projects={projectDistribution} />
        <TimeDistributionChart distribution={timeDistribution} />
      </div>

      {/* Recent Activity Feed */}
      <RecentActivity activities={recentActivity} />
    </div>
  );
};
