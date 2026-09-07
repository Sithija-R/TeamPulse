import React from 'react';
import { ReportReview } from '../../types/review';
import { AlertCircle, MessageSquare, Calendar } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

interface CorrectionFeedbackProps {
  review?: ReportReview;
}

export const CorrectionFeedback: React.FC<CorrectionFeedbackProps> = ({ review }) => {
  if (!review) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Action Required: Revisions Needed</h4>
          <p className="mt-0.5 text-amber-800">
            Your manager has requested updates to this report. Please review the tasks, blockers, or time allocations and resubmit.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h4 className="font-bold text-amber-950 text-sm">Manager Feedback & Correction Notes</h4>
        </div>
        <div className="flex items-center gap-3 text-xs text-amber-800">
          <span className="flex items-center gap-1 font-semibold">
            <MessageSquare className="h-3.5 w-3.5" />
            Reviewer: {review.managerName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateTime(review.createdAt)}
          </span>
        </div>
      </div>

      <div className="rounded-lg bg-white p-3.5 border border-amber-200 text-xs text-[#171A18]">
        <p className="font-medium whitespace-pre-line leading-relaxed">{review.comment}</p>
      </div>

      <div className="text-[11px] font-medium text-amber-800">
        &bull; Please update your report details below and click <strong>"Resubmit Report"</strong> when ready.
      </div>
    </div>
  );
};
