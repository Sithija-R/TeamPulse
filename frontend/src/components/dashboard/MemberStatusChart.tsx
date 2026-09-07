import React from 'react';
import { MemberSubmissionStatus } from '../../types/dashboard';
import { StatusBadge } from '../common/StatusBadge';
import { Link } from 'react-router-dom';
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface MemberStatusChartProps {
  statuses: MemberSubmissionStatus[];
}

export const MemberStatusChart: React.FC<MemberStatusChartProps> = ({ statuses }) => {
  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#171A18]">Team Submission Status</h3>
          <p className="text-xs text-[#6B726D]">Real-time reporting status per team member</p>
        </div>
        <Link
          to="/management/reports"
          className="text-xs font-semibold text-[#171A18] hover:underline flex items-center gap-1"
        >
          View All Reports <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E5E7E5] bg-[#F7F8F7] text-[#6B726D]">
              <th className="py-2.5 px-3 font-semibold">Team Member</th>
              <th className="py-2.5 px-3 font-semibold">Project</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3 font-semibold">Blockers</th>
              <th className="py-2.5 px-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7E5]">
            {statuses.map((member) => (
              <tr key={member.userId} className="hover:bg-[#F7F8F7]/50 transition-colors">
                <td className="py-3 px-3">
                  <Link
                    to={`/management/team/${member.userId}`}
                    className="font-medium text-[#171A18] hover:underline block"
                  >
                    {member.userName}
                  </Link>
                  <span className="text-[11px] text-[#9AA19C]">{member.email}</span>
                </td>
                <td className="py-3 px-3 text-[#6B726D] font-medium">
                  {member.projectName}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={member.status} type="report" size="sm" />
                </td>
                <td className="py-3 px-3">
                  {member.blockersCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <AlertTriangle className="h-3 w-3" />
                      {member.blockersCount} open
                    </span>
                  ) : (
                    <span className="text-[#9AA19C]">&mdash;</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  {member.reportId ? (
                    <Link
                      to={`/management/reports/${member.reportId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#171A18] hover:text-[#171A18]/80 bg-[#F7F8F7] hover:bg-[#8DF688]/30 px-2.5 py-1 rounded-md border border-[#E5E7E5] transition-colors"
                    >
                      {member.status === 'SUBMITTED' ? 'Review' : 'View'}
                    </Link>
                  ) : (
                    <span className="text-[11px] text-[#9AA19C] italic">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
