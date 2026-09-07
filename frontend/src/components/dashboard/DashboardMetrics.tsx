import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { DashboardMetrics as MetricsType } from '../../types/dashboard';
import { FileText, CheckCircle2, AlertCircle, AlertTriangle, Layers } from 'lucide-react';

interface DashboardMetricsProps {
  metrics: MetricsType;
  isManager?: boolean;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  metrics,
  isManager = false,
}) => {
  if (isManager) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Reports"
          value={metrics.totalReports}
          subtext="Across all weeks"
          icon={<FileText className="h-4 w-4" />}
        />
        <MetricCard
          title="Submitted This Week"
          value={metrics.submittedThisWeek}
          subtext="Week 36 current"
          icon={<CheckCircle2 className="h-4 w-4 text-[#171A18]" />}
          highlight={true}
        />
        <MetricCard
          title="Compliance Rate"
          value={`${metrics.complianceRate}%`}
          subtext="On-time submissions"
          icon={<Layers className="h-4 w-4" />}
          trend={{ value: '+4%', isPositive: true }}
        />
        <MetricCard
          title="Needs Correction"
          value={metrics.needsCorrection}
          subtext="Awaiting revisions"
          icon={<AlertCircle className="h-4 w-4 text-amber-600" />}
        />
        <MetricCard
          title="Open Blockers"
          value={metrics.openBlockers}
          subtext="Unresolved key issues"
          icon={<AlertTriangle className="h-4 w-4 text-rose-600" />}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Submitted Reports"
        value={metrics.submittedCount + metrics.approvedCount}
        subtext="Total completed reports"
        icon={<FileText className="h-4 w-4" />}
      />
      <MetricCard
        title="Approved Reports"
        value={metrics.approvedCount}
        subtext="Manager verified"
        icon={<CheckCircle2 className="h-4 w-4" />}
        highlight={true}
      />
      <MetricCard
        title="Needs Correction"
        value={metrics.needsCorrection}
        subtext="Requires updates"
        icon={<AlertCircle className="h-4 w-4" />}
      />
      <MetricCard
        title="Open Blockers"
        value={metrics.openBlockers}
        subtext="Impacts current sprint"
        icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
      />
    </div>
  );
};
