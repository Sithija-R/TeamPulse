import { AlertCircle, CheckCircle2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "../../lib/utils";
import type { ReportReview } from "../../types/review";

interface ReviewHistoryProps {
  reviews: ReportReview[];
}

export function ReviewHistory({ reviews }: ReviewHistoryProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <Card className="border-dashed border-[#E5E7E5] bg-white shadow-sm">
        <CardContent className="p-6 text-center text-xs text-[#6B726D]">
          No review history logged yet for this report.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#E5E7E5] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#171A18]">
            <MessageSquare className="h-4 w-4" />
            Review History Log
          </CardTitle>
          <Badge
            variant="outline"
            className="border-[#E5E7E5] bg-[#F7F8F7] text-xs font-medium text-[#6B726D]"
          >
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}{" "}
            Recorded
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <div className="space-y-3">
          {reviews.map((rev) => {
            const isApproved = rev.action === "APPROVED";

            return (
              <Card
                key={rev.id}
                className={`rounded-xl shadow-none transition-colors ${
                  isApproved
                    ? "border-[#8DF688] bg-[#8DF688]/10"
                    : "border-amber-200 bg-amber-50/40"
                }`}
              >
                <CardContent className="space-y-2.5 p-4 text-xs">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      {isApproved ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-700" />
                      )}

                      <span className="font-bold text-[#171A18]">
                        {isApproved ? "Approved" : "Changes Requested"} by{" "}
                        {rev.managerName}
                      </span>

                      <Badge
                        variant="outline"
                        className="border-[#E5E7E5] bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B726D]"
                      >
                        Version {rev.versionNumber}
                      </Badge>
                    </div>

                    <span className="text-[11px] text-[#6B726D]">
                      {formatDateTime(rev.createdAt)}
                    </span>
                  </div>

                  <div className="rounded-lg border border-[#E5E7E5]/60 bg-white/80 p-3 font-medium leading-relaxed whitespace-pre-line text-[#171A18]">
                    {rev.comment}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}