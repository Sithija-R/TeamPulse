import React from 'react';
import { WeeklyReport } from '../../types/report';
import { StatusBadge } from '../common/StatusBadge';
import { ReportTaskTable } from './ReportTaskTable';
import { formatDate, formatDateTime } from '../../lib/utils';
import { TASK_TYPE_LABELS } from '../../lib/constants';
import { Calendar, User, Briefcase, FileText, CheckSquare, AlertTriangle, Trophy, Clock, StickyNote } from 'lucide-react';

interface ReportSummaryProps {
  report: WeeklyReport;
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ report }) => {
  const totalHours = report.timeEntries.reduce((acc, t) => acc + t.hours, 0);

  return (
    <div className="space-y-6">
      {/* Header Info Card */}
      <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7E5] pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#171A18] my-0">{report.projectName}</h2>
              <StatusBadge status={report.status} type="report" size="lg" />
            </div>
            <p className="text-xs text-[#6B726D] mt-1">
              Weekly Report &bull; {formatDate(report.weekStartDate)} &ndash; {formatDate(report.weekEndDate)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {report.submittedAt && (
              <span className="rounded-lg bg-[#F7F8F7] border border-[#E5E7E5] px-3 py-1.5 text-[#6B726D]">
                Submitted: <strong className="text-[#171A18]">{formatDateTime(report.submittedAt)}</strong>
              </span>
            )}
            {report.approvedAt && (
              <span className="rounded-lg bg-[#8DF688]/20 border border-[#8DF688] px-3 py-1.5 text-[#171A18] font-semibold">
                Approved: {formatDateTime(report.approvedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="flex items-center gap-3 rounded-lg bg-[#F7F8F7] p-3 border border-[#E5E7E5]">
            <User className="h-4 w-4 text-[#6B726D]" />
            <div>
              <span className="text-[#6B726D] block text-[11px]">Submitted By</span>
              <span className="font-bold text-[#171A18]">{report.userName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-[#F7F8F7] p-3 border border-[#E5E7E5]">
            <Briefcase className="h-4 w-4 text-[#6B726D]" />
            <div>
              <span className="text-[#6B726D] block text-[11px]">Project Workspace</span>
              <span className="font-bold text-[#171A18]">{report.projectName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-[#F7F8F7] p-3 border border-[#E5E7E5]">
            <Clock className="h-4 w-4 text-[#6B726D]" />
            <div>
              <span className="text-[#6B726D] block text-[11px]">Logged Time</span>
              <span className="font-bold text-[#171A18]">{totalHours} Hours Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <CheckSquare className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">Completed Tasks & Deliverables</h3>
        </div>
        <ReportTaskTable tasks={report.tasks} isEditable={false} />
      </div>

      {/* Next Week Tasks */}
      <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <Calendar className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">Planned Tasks for Next Week</h3>
        </div>
        {report.nextWeekTasks ? (
          <div className="rounded-lg bg-[#F7F8F7] p-4 text-xs font-medium text-[#171A18] whitespace-pre-line leading-relaxed border border-[#E5E7E5]">
            {report.nextWeekTasks}
          </div>
        ) : (
          <p className="text-xs text-[#9AA19C] italic">No next week plans recorded.</p>
        )}
      </div>

      {/* Blockers & Achievements Two Column */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Blockers */}
        <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-base font-bold text-[#171A18]">Blockers & Impediments</h3>
          </div>
          {report.blockers.length === 0 ? (
            <p className="text-xs text-[#9AA19C] italic">No blockers encountered this week.</p>
          ) : (
            <div className="space-y-2">
              {report.blockers.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-lg p-3 text-xs border ${
                    b.keyIssue ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{b.keyIssue ? '⚠️ KEY ISSUE' : 'Blocker'}</span>
                    <span>{b.resolved ? '✓ Resolved' : 'Pending Resolution'}</span>
                  </div>
                  <p className="mt-1 font-medium">{b.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
            <Trophy className="h-4 w-4 text-[#171A18]" />
            <h3 className="text-base font-bold text-[#171A18]">Key Achievements</h3>
          </div>
          {report.achievements.length === 0 ? (
            <p className="text-xs text-[#9AA19C] italic">No highlights recorded.</p>
          ) : (
            <div className="space-y-2">
              {report.achievements.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-lg p-3 text-xs border ${
                    a.keyAchievement ? 'bg-[#8DF688]/20 border-[#8DF688] text-[#171A18]' : 'bg-[#F7F8F7] border-[#E5E7E5] text-[#171A18]'
                  }`}
                >
                  <p className="font-semibold">{a.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Time Entries & Notes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Time Breakdown */}
        <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E5E7E5] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#171A18]" />
              <h3 className="text-base font-bold text-[#171A18]">Time Breakdown</h3>
            </div>
            <span className="text-xs font-bold text-[#171A18]">{totalHours} Hours Logged</span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {report.timeEntries.map((t) => (
              <div key={t.id} className="rounded-lg bg-[#F7F8F7] p-2.5 border border-[#E5E7E5] text-xs">
                <span className="text-[#6B726D] block text-[11px]">{TASK_TYPE_LABELS[t.taskType]}</span>
                <span className="font-bold text-[#171A18]">{t.hours} hrs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
            <StickyNote className="h-4 w-4 text-[#171A18]" />
            <h3 className="text-base font-bold text-[#171A18]">Additional Notes</h3>
          </div>
          {report.notes ? (
            <p className="text-xs text-[#171A18] font-medium leading-relaxed bg-[#F7F8F7] p-3 rounded-lg border border-[#E5E7E5]">
              {report.notes}
            </p>
          ) : (
            <p className="text-xs text-[#9AA19C] italic">No additional notes provided.</p>
          )}
        </div>
      </div>
    </div>
  );
};
