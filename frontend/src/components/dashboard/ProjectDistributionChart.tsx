import { Briefcase, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectDistributionChartProps {
  projects: Record<string, number>;
}

export function ProjectDistributionChart({ projects }: ProjectDistributionChartProps) {
  const projectEntries = Object.entries(projects);
  const maxReports = Math.max(...projectEntries.map(([, count]) => count), 1);

  return (
    <Card className="border-[#E5E7E5] bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-bold text-[#171A18]">
              Project Distribution
            </CardTitle>
            <p className="mt-1 text-xs text-[#6B726D]">
              Reports submitted across active projects
            </p>
          </div>
          <Briefcase className="h-4 w-4 text-[#6B726D]" />
        </div>
      </CardHeader>

      <CardContent>
        {projectEntries.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6B726D]">
            No project data available.
          </div>
        ) : (
          <div className="space-y-4">
            {projectEntries.map(([projectName, reportCount]) => {
              const percent = Math.round((reportCount / maxReports) * 100);

              return (
                <div key={projectName} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-[#171A18]">
                      {projectName}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-[#E5E7E5] bg-[#F7F8F7] text-[10px] font-semibold text-[#6B726D]"
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      {reportCount} {reportCount === 1 ? "report" : "reports"}
                    </Badge>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#E5E7E5] bg-[#F7F8F7]">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-full bg-[#8DF688] transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}