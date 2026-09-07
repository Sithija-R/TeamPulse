import React from 'react';
import { ActivityItem } from '../../types/dashboard';
import { formatDateTime } from '../../lib/utils';
import { CheckCircle2, AlertCircle, Send, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'APPROVED':
        return <CheckCircle2 className="h-3.5 w-3.5 text-[#171A18]" />;
      case 'CHANGES_REQUESTED':
        return <AlertCircle className="h-3.5 w-3.5 text-amber-700" />;
      case 'BLOCKER_ADDED':
        return <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />;
      case 'SUBMITTED':
      default:
        return <Send className="h-3.5 w-3.5 text-blue-600" />;
    }
  };

  const getBadgeClass = (type: ActivityItem['type']) => {
    switch (type) {
      case 'APPROVED':
        return 'bg-[#8DF688]';
      case 'CHANGES_REQUESTED':
        return 'bg-amber-100';
      case 'BLOCKER_ADDED':
        return 'bg-rose-100';
      case 'SUBMITTED':
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#171A18]">Recent Activity Stream</h3>
          <p className="text-xs text-[#6B726D]">Live updates on submissions, reviews, and issues</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3 text-xs">
            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${getBadgeClass(item.type)} mt-0.5`}>
              {getIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#171A18] truncate">
                  {item.userName}
                </span>
                <span className="text-[11px] text-[#9AA19C] flex-shrink-0">
                  {formatDateTime(item.timestamp)}
                </span>
              </div>
              <p className="text-[#6B726D] mt-0.5 line-clamp-1">{item.details}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px]">
                <span className="font-medium text-[#171A18]">{item.projectName}</span>
                <Link
                  to={`/management/reports/${item.reportId}`}
                  className="text-xs font-semibold text-[#171A18] hover:underline"
                >
                  View Report &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
