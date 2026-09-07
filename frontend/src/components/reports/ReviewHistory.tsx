import React from 'react';
import { ReportReview } from '../../types/review';
import { formatDateTime } from '../../lib/utils';
import { CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface ReviewHistoryProps {
  reviews: ReportReview[];
}

export const ReviewHistory: React.FC<ReviewHistoryProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E5E7E5] p-6 text-center text-xs text-[#6B726D]">
        No review history logged yet for this report.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5E7E5] pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-sm font-bold text-[#171A18]">Review History Log</h3>
        </div>
        <span className="text-xs text-[#6B726D] font-medium">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'} Recorded
        </span>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`rounded-xl border p-4 text-xs space-y-2.5 transition-colors ${
              rev.action === 'APPROVED'
                ? 'border-[#8DF688] bg-[#8DF688]/10'
                : 'border-amber-200 bg-amber-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {rev.action === 'APPROVED' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-700" />
                )}
                <span className="font-bold text-[#171A18]">
                  {rev.action === 'APPROVED' ? 'Approved' : 'Changes Requested'} by {rev.managerName}
                </span>
                <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B726D] border border-[#E5E7E5]">
                  Version {rev.versionNumber}
                </span>
              </div>
              <span className="text-[11px] text-[#6B726D]">
                {formatDateTime(rev.createdAt)}
              </span>
            </div>

            <p className="font-medium text-[#171A18] leading-relaxed bg-white/80 p-3 rounded-lg border border-[#E5E7E5]/60 whitespace-pre-line">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
