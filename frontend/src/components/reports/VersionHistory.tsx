import React, { useState } from 'react';
import { ReportVersion } from '../../types/review';
import { WeeklyReport } from '../../types/report';
import { formatDateTime } from '../../lib/utils';
import { History, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import { ReportSummary } from './ReportSummary';

interface VersionHistoryProps {
  versions: ReportVersion[];
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ versions }) => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<{
    versionNumber: number;
    report: WeeklyReport;
  } | null>(null);

  if (!versions || versions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E5E7E5] p-6 text-center text-xs text-[#6B726D]">
        No version history available.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5E7E5] pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-sm font-bold text-[#171A18]">Report Version History</h3>
        </div>
        <span className="text-xs text-[#6B726D] font-medium">
          {versions.length} {versions.length === 1 ? 'Version' : 'Versions'} Tracked
        </span>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7E5]">
        {versions.map((ver, idx) => {
          let parsedReport: WeeklyReport | null = null;
          try {
            parsedReport = JSON.parse(ver.contentSnapshot);
          } catch {
            parsedReport = null;
          }

          return (
            <div key={ver.id} className="relative group">
              {/* Node dot */}
              <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-[#171A18] text-[#171A18]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8DF688]" />
              </div>

              <div className="rounded-xl border border-[#E5E7E5] bg-[#F7F8F7]/50 p-4 space-y-2 hover:border-[#171A18] transition-colors">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#171A18]">
                      Version {ver.versionNumber}
                    </span>
                    {idx === versions.length - 1 && (
                      <span className="rounded-full bg-[#8DF688] px-2 py-0.5 text-[10px] font-bold text-[#171A18]">
                        LATEST
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#6B726D]">
                    Submitted {formatDateTime(ver.createdAt)}
                  </span>
                </div>

                <div className="text-xs text-[#6B726D]">
                  <span>Submitted by: </span>
                  <span className="font-semibold text-[#171A18]">
                    {ver.submittedBy || 'Team Member'}
                  </span>
                </div>

                {ver.reviewComment && (
                  <div className="rounded-lg bg-amber-50 p-2.5 border border-amber-200 text-xs text-amber-900">
                    <span className="font-semibold">Review note: </span>
                    {ver.reviewComment}
                  </div>
                )}

                {parsedReport && (
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#6B726D]">
                      <span>{parsedReport.tasks.length} Tasks</span>
                      <span>&bull;</span>
                      <span>{parsedReport.blockers.length} Blockers</span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        parsedReport &&
                        setSelectedSnapshot({
                          versionNumber: ver.versionNumber,
                          report: parsedReport,
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#171A18] hover:underline cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Inspect Version Snapshot &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Snapshot Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#E5E7E5] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7E5] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#171A18]">
                  Version {selectedSnapshot.versionNumber} Snapshot
                </h3>
                <p className="text-xs text-[#6B726D]">
                  Read-only view of historical report data
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSnapshot(null)}
                className="rounded-lg border border-[#E5E7E5] px-3 py-1.5 text-xs font-bold text-[#171A18] hover:bg-[#F7F8F7] cursor-pointer"
              >
                Close Snapshot
              </button>
            </div>

            <ReportSummary report={selectedSnapshot.report} />
          </div>
        </div>
      )}
    </div>
  );
};
