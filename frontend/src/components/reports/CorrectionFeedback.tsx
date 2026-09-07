import { AlertCircle, MessageSquare, Calendar } from "lucide-react";
import { formatDateTime } from "../../lib/utils";
import type { ReportReview } from "../../types/review";

interface CorrectionFeedbackProps {
  review?: ReportReview;
}

export function CorrectionFeedback({ review }: CorrectionFeedbackProps) {
  if (!review) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">Action Required: Revisions Needed</h4>
          <p className="mt-0.5 text-amber-800">
            Your manager has requested updates to this report. Please review the tasks, blockers, or time allocations and resubmit.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-amber-300 bg-amber-50/80 p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h4 className="text-sm font-bold text-amber-950">Manager Feedback & Correction Notes</h4>
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

      <div className="rounded-lg border border-amber-200 bg-white p-3.5 text-xs text-[#171A18]">
        <p className="whitespace-pre-line font-medium leading-relaxed">{review.comment}</p>
      </div>

      <div className="text-[11px] font-medium text-amber-800">
        &bull; Please update your report details below and click <strong>"Resubmit Report"</strong> when ready.
      </div>
    </div>
  );
}