import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "../../lib/utils";
import type { RecentActivity as RecentReview } from "../../types/dashboard";

interface RecentActivityProps {
  activities: RecentReview[];
}

function getReviewIcon(action: string) {
  return action === "APPROVED" ? (
    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
  ) : (
    <AlertCircle className="h-4 w-4 text-amber-700" />
  );
}

function getReviewBadgeClass(action: string) {
  return action === "APPROVED"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-amber-200 bg-amber-50 text-amber-700";
}

function getReviewLabel(action: string) {
  return action === "APPROVED" ? "Approved" : "Changes Requested";
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="border-[#E5E7E5] bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold text-[#171A18]">
          Recent Reviews
        </CardTitle>
        <p className="text-xs text-[#6B726D]">
          Latest manager reviews and feedback on submitted reports
        </p>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6B726D]">
            No recent reviews available.
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((review, index) => (
              <div
                key={`${review.reportId}-${review.createdAt}-${index}`}
                className="flex items-start gap-3 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] p-3"
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${getReviewBadgeClass(review.action)}`}
                >
                  {getReviewIcon(review.action)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#171A18]">
                        {review.memberName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`px-2 py-0.5 text-[10px] font-semibold ${getReviewBadgeClass(review.action)}`}
                      >
                        {getReviewLabel(review.action)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[#E5E7E5] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#6B726D]"
                      >
                        Report #{review.reportId}
                      </Badge>
                    </div>
                    <span className="shrink-0 text-[11px] text-[#9AA19C]">
                      {formatDateTime(review.createdAt)}
                    </span>
                  </div>
                  {review.comment && (
                    <div className="mt-2 rounded-lg border border-[#E5E7E5] bg-white px-3 py-2.5">
                      <p className="text-xs leading-relaxed text-[#6B726D]">
                        {review.comment}
                      </p>
                    </div>
                  )}
                  <div className="mt-2">
                    <Link
                      to={`/management/reports/${review.reportId}`}
                      className="text-[11px] font-semibold text-[#171A18] hover:underline"
                    >
                      View Report →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}