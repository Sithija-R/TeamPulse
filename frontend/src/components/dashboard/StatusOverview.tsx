import React from 'react';
import type { DashboardMetrics } from '../../types/dashboard';

interface StatusOverviewProps {
  metrics: DashboardMetrics;
}

export const StatusOverview: React.FC<StatusOverviewProps> = ({ metrics }) => {
  const statuses = [
    { label: 'Draft', count: metrics.draftCount, color: 'bg-gray-300' },
    { label: 'Submitted', count: metrics.submittedCount, color: 'bg-blue-400' },
    { label: 'Needs Correction', count: metrics.needsCorrection, color: 'bg-amber-400' },
    { label: 'Approved', count: metrics.approvedCount, color: 'bg-[#8DF688]' },
    { label: 'Not Started', count: metrics.notStartedCount, color: 'bg-rose-300' },
  ];

  const total = statuses.reduce((acc, s) => acc + s.count, 0) || 1;

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#171A18]">Weekly Status Overview</h3>
          <p className="text-xs text-[#6B726D]">Current week submission breakdown across team</p>
        </div>
        <span className="text-xs font-semibold text-[#6B726D] bg-[#F7F8F7] px-2.5 py-1 rounded-full border border-[#E5E7E5]">
          Total: {total} Members
        </span>
      </div>

      {/* Segmented Bar */}
      <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-[#F7F8F7] p-0.5 border border-[#E5E7E5]">
        {statuses.map(
          (s, idx) =>
            s.count > 0 && (
              <div
                key={idx}
                style={{ width: `${(s.count / total) * 100}%` }}
                className={`h-full ${s.color} transition-all duration-300`}
                title={`${s.label}: ${s.count}`}
              />
            )
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statuses.map((s, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
            <div className="text-xs">
              <span className="font-semibold text-[#171A18]">{s.count}</span>{' '}
              <span className="text-[#6B726D]">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
