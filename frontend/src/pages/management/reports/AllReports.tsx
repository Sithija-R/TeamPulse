import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../../../hooks/useReports';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { DUMMY_USERS, DUMMY_PROJECTS } from '../../../lib/dummyData';
import { formatDate } from '../../../lib/utils';
import { Search, Filter, Eye, CheckSquare, Calendar } from 'lucide-react';

export const AllReports: React.FC = () => {
  const { reports } = useReports();
  const [memberFilter, setMemberFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const teamMembers = DUMMY_USERS.filter((u) => u.role === 'TEAM_MEMBER');

  const filteredReports = reports.filter((report) => {
    if (memberFilter !== 'ALL' && report.userId !== Number(memberFilter)) {
      return false;
    }
    if (projectFilter !== 'ALL' && report.projectId !== Number(projectFilter)) {
      return false;
    }
    if (statusFilter !== 'ALL' && report.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUser = report.userName.toLowerCase().includes(q);
      const matchProject = report.projectName.toLowerCase().includes(q);
      const matchTasks = report.tasks.some((t) => t.taskName.toLowerCase().includes(q));
      if (!matchUser && !matchProject && !matchTasks) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Weekly Team Reports"
        description="Filter, review, and approve team submissions across projects."
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#E5E7E5] bg-white p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs max-w-sm">
          <Search className="h-3.5 w-3.5 text-[#6B726D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member, project, or task..."
            className="w-full bg-transparent text-[#171A18] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#6B726D]">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          {/* Member Filter */}
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs font-semibold text-[#171A18] outline-none cursor-pointer"
          >
            <option value="ALL">All Members</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs font-semibold text-[#171A18] outline-none cursor-pointer"
          >
            <option value="ALL">All Projects</option>
            {DUMMY_PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs font-semibold text-[#171A18] outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="NEEDS_CORRECTION">Needs Correction</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
      </div>

      {/* Main Reports Table */}
      <div className="rounded-xl border border-[#E5E7E5] bg-white overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B726D]">
            No reports matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7E5] bg-[#F7F8F7] text-[#6B726D]">
                  <th className="py-3 px-4 font-semibold">Team Member</th>
                  <th className="py-3 px-4 font-semibold">Project</th>
                  <th className="py-3 px-4 font-semibold">Week Period</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Submitted Date</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7E5]">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#F7F8F7]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#171A18]">
                      <Link
                        to={`/management/team/${report.userId}`}
                        className="hover:underline"
                      >
                        {report.userName}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B726D] font-medium">
                      {report.projectName}
                    </td>
                    <td className="py-3.5 px-4 text-[#171A18]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#6B726D]" />
                        {formatDate(report.weekStartDate)} &ndash; {formatDate(report.weekEndDate)}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={report.status} type="report" size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-[#6B726D]">
                      {formatDate(report.submittedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {report.status === 'SUBMITTED' ? (
                        <Link
                          to={`/management/reports/${report.id}/review`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#171A18] bg-[#8DF688] hover:bg-[#7ae875] px-3 py-1 rounded-lg transition-colors shadow-xs"
                        >
                          <CheckSquare className="h-3.5 w-3.5" />
                          Review
                        </Link>
                      ) : (
                        <Link
                          to={`/management/reports/${report.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] px-3 py-1 rounded-lg border border-[#E5E7E5] transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#6B726D]" />
                          View
                        </Link>
                      )}
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
