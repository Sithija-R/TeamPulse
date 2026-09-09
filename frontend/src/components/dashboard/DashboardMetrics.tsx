import { FileText, CheckCircle2, AlertCircle, AlertTriangle, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardResponse } from "../../types/dashboard";

interface DashboardMetricsProps {
  metrics: DashboardResponse;
}

interface MetricItem {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  borderClassName: string;
  iconClassName: string;
  valueClassName: string;
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const managerMetrics: MetricItem[] = [
    {
      title: "Total Reports",
      value: metrics.totalReports,
      subtext: "Across all weeks",
      icon: <FileText className="h-4 w-4" />,
      borderClassName: "border-blue-200",
      iconClassName: "bg-blue-50 text-blue-600",
      valueClassName: "text-blue-700",
    },
    {
      title: "Submitted This Week",
      value: metrics.submittedThisWeek,
      subtext: "Current week",
      icon: <CheckCircle2 className="h-4 w-4" />,
      borderClassName: "border-emerald-200",
      iconClassName: "bg-emerald-50 text-emerald-600",
      valueClassName: "text-emerald-700",
    },
    {
      title: "Compliance Rate",
      value: `${metrics.complianceRate}%`,
      subtext: "On-time submissions",
      icon: <Layers className="h-4 w-4" />,
      borderClassName: "border-[#8DF688]",
      iconClassName: "bg-[#8DF688]/30 text-[#171A18]",
      valueClassName: "text-[#171A18]",
    },
    {
      title: "Needs Correction",
      value: metrics.needsCorrectionCount,
      subtext: "Awaiting revisions",
      icon: <AlertCircle className="h-4 w-4" />,
      borderClassName: "border-amber-200",
      iconClassName: "bg-amber-50 text-amber-600",
      valueClassName: "text-amber-700",
    },
    {
      title: "Open Blockers",
      value: metrics.openBlockers,
      subtext: "Unresolved key issues",
      icon: <AlertTriangle className="h-4 w-4" />,
      borderClassName: "border-rose-200",
      iconClassName: "bg-rose-50 text-rose-600",
      valueClassName: "text-rose-700",
    },
  ];

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 `}>
      {managerMetrics.map((metric) => (
        <Card
          key={metric.title}
          className={`bg-white shadow-sm transition-shadow hover:shadow-md ${metric.borderClassName}`}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#6B726D]">{metric.title}</p>
                <p className={`mt-2 text-2xl font-bold ${metric.valueClassName}`}>
                  {metric.value}
                </p>
                <p className="mt-1 text-[11px] font-medium text-[#8A908C]">
                  {metric.subtext}
                </p>
              </div>

              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${metric.iconClassName}`}>
                {metric.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}