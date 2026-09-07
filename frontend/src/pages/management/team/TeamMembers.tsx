import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useDashboard } from '../../../hooks/useDashboard';
import { DUMMY_USERS } from '../../../lib/dummyData';
import { Mail, Shield, ChevronRight } from 'lucide-react';

export const TeamMembers: React.FC = () => {
  const { memberStatuses } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Members Directory"
        description="Monitor individual reporting status, departmental assignments, and performance."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memberStatuses.map((member) => {
          const userDetails = DUMMY_USERS.find((u) => u.id === member.userId);

          return (
            <Link
              key={member.userId}
              to={`/management/team/${member.userId}`}
              className="group rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-xs hover:border-[#171A18] hover:shadow-md transition-all space-y-4 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#171A18] text-white text-sm font-bold">
                    {member.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#171A18] group-hover:underline">
                      {member.userName}
                    </h3>
                    <div className="text-[11px] text-[#6B726D] flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9AA19C] group-hover:text-[#171A18] transition-colors" />
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E5E7E5]">
                <div>
                  <span className="text-[#6B726D] block text-[10px]">Project</span>
                  <span className="font-semibold text-[#171A18]">{member.projectName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#6B726D] block text-[10px]">Current Status</span>
                  <StatusBadge status={member.status} type="report" size="sm" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#6B726D] bg-[#F7F8F7] px-3 py-1.5 rounded-lg border border-[#E5E7E5]">
                <span className="flex items-center gap-1 font-medium text-[#171A18]">
                  <Shield className="h-3 w-3 text-[#8DF688]" />
                  {userDetails?.department || 'Engineering'}
                </span>
                <span>Compliance: {userDetails?.reportCompletionRate || 95}%</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
