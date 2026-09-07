import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { ErrorState } from '../../../components/common/ErrorState';
import { useReports } from '../../../hooks/useReports';
import { DUMMY_USERS } from '../../../lib/dummyData';
import { formatDate } from '../../../lib/utils';
import { Mail, Shield, Award, CheckCircle2, Clock, Eye } from 'lucide-react';

export const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reports } = useReports();

  const userId = Number(id);
  const member = DUMMY_USERS.find((u) => u.id === userId);

  if (!member) {
    return (
      <ErrorState
        title="Member Not Found"
        message="The requested team member profile does not exist."
        onRetry={() => navigate('/management/team')}
      />
    );
  }

  const memberReports = reports.filter((r) => r.userId === userId);
  const currentReport = memberReports.find((r) => r.weekStartDate === '2026-09-01');
  const approvedCount = memberReports.filter((r) => r.status === 'APPROVED').length;
  const totalHours = memberReports.reduce(
    (acc, r) => acc + r.timeEntries.reduce((tAcc, t) => tAcc + t.hours, 0),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Member Profile &bull; ${member.name}`}
        description={`${member.department || 'Engineering'} &bull; Joined ${formatDate(member.joinedDate)}`}
        breadcrumbs={[
          { label: 'Team Members', href: '/management/team' },
          { label: member.name },
        ]}
      />

      {/* Profile Info Header */}
      <div className="rounded-2xl border border-[#E5E7E5] bg-white p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7E5] pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#171A18] text-white text-xl font-bold">
              {member.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#171A18] my-0">{member.name}</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-[#6B726D]">
                <Mail className="h-3.5 w-3.5" />
                <span>{member.email}</span>
                <span>&bull;</span>
                <Shield className="h-3.5 w-3.5 text-[#8DF688]" />
                <span className="font-semibold text-[#171A18]">{member.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#8DF688]/20 border border-[#8DF688] px-3.5 py-1 text-xs font-bold text-[#171A18]">
              {member.reportCompletionRate || 95}% Compliance Score
            </span>
          </div>
        </div>

        {/* Reporting Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="flex items-center gap-3 rounded-xl bg-[#F7F8F7] p-4 border border-[#E5E7E5]">
            <Award className="h-5 w-5 text-emerald-600" />
            <div>
              <span className="text-[#6B726D] block">Current Week Status</span>
              <div className="mt-0.5">
                <StatusBadge status={currentReport ? currentReport.status : 'NOT_STARTED'} type="report" size="sm" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[#F7F8F7] p-4 border border-[#E5E7E5]">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <div>
              <span className="text-[#6B726D] block">Approved Submissions</span>
              <span className="text-lg font-bold text-[#171A18]">{approvedCount} Reports</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[#F7F8F7] p-4 border border-[#E5E7E5]">
            <Clock className="h-5 w-5 text-[#171A18]" />
            <div>
              <span className="text-[#6B726D] block">Logged Hours</span>
              <span className="text-lg font-bold text-[#171A18]">{totalHours} Hours Logged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Reports Table */}
      <div className="rounded-2xl border border-[#E5E7E5] bg-white p-6 space-y-4">
        <h3 className="text-base font-bold text-[#171A18] border-b border-[#E5E7E5] pb-3">
          Member Submissions & History
        </h3>

        {memberReports.length === 0 ? (
          <p className="text-xs text-[#6B726D] italic">No reports recorded for this member yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7E5] bg-[#F7F8F7] text-[#6B726D]">
                  <th className="py-3 px-3 font-semibold">Week Period</th>
                  <th className="py-3 px-3 font-semibold">Project</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Submitted Date</th>
                  <th className="py-3 px-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7E5]">
                {memberReports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#F7F8F7]/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#171A18]">
                      {formatDate(report.weekStartDate)} &ndash; {formatDate(report.weekEndDate)}
                    </td>
                    <td className="py-3 px-3 text-[#6B726D] font-medium">{report.projectName}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={report.status} type="report" size="sm" />
                    </td>
                    <td className="py-3 px-3 text-[#6B726D]">{formatDate(report.submittedAt)}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/management/reports/${report.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#171A18] hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
