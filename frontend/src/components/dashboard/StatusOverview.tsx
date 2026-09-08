import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DashboardResponse } from "../../types/dashboard";

interface StatusOverviewProps {
  metrics: DashboardResponse;
}

export function StatusOverview({ metrics }: StatusOverviewProps) {
  const statuses = [
    { label: "Submitted", count: metrics.submittedCount, color: "bg-blue-400" },
    { label: "Needs Correction", count: metrics.needsCorrectionCount, color: "bg-amber-400" },
    { label: "Approved", count: metrics.approvedCount, color: "bg-[#8DF688]" },
    { label: "Not Started", count: metrics.notStartedCount, color: "bg-rose-300" },
  ];

  const total = statuses.reduce((acc, status) => acc + status.count, 0) || 1;

  return (
    <Card className="border-[#E5E7E5] bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-bold text-[#171A18]">
              Weekly Status Overview
            </CardTitle>
            <p className="mt-1 text-xs text-[#6B726D]">
              Current week submission breakdown across team
            </p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-[#E5E7E5] bg-[#F7F8F7] px-2.5 py-1 text-xs font-semibold text-[#6B726D]"
          >
            Total: {total} Members
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex h-3.5 w-full overflow-hidden rounded-full border border-[#E5E7E5] bg-[#F7F8F7] p-0.5">
          {statuses.map(
            (status) =>
              status.count > 0 && (
                <div
                  key={status.label}
                  style={{ width: `${(status.count / total) * 100}%` }}
                  className={`h-full ${status.color} transition-all duration-300`}
                  title={`${status.label}: ${status.count}`}
                />
              )
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {statuses.map((status) => (
            <div key={status.label} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.color}`} />
              <div className="text-xs">
                <span className="font-semibold text-[#171A18]">{status.count}</span>{" "}
                <span className="text-[#6B726D]">{status.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}