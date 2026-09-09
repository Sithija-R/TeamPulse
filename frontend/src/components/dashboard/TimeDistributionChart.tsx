import { PieChart as PieChartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TASK_TYPE_LABELS } from "../../lib/constants";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface TimeDistributionChartProps {
  distribution: Record<string, number>;
}

const categoryColors: Record<string, string> = {
  DEVELOPMENT: "#8DF688",
  TESTING: "#60A5FA",
  MEETINGS: "#FBBF24",
  DOCUMENTATION: "#A78BFA",
  RESEARCH: "#2DD4BF",
  OTHER: "#9CA3AF",
};

export function TimeDistributionChart({ distribution }: TimeDistributionChartProps) {
  const data = Object.entries(distribution)
    .map(([taskType, hours]) => ({
      taskType,
      name: TASK_TYPE_LABELS[taskType] ?? taskType,
      hours: Number(hours || 0),
    }))
    .filter((item) => item.hours > 0);

  const totalHours = data.reduce((total, item) => total + item.hours, 0);

  return (
    <Card className="border-[#E5E7E5] bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-bold text-[#171A18]">
              Time Distribution by Category
            </CardTitle>
            <p className="mt-1 text-xs text-[#6B726D]">
              Aggregate team effort across task types
            </p>
          </div>
          <PieChartIcon className="h-4 w-4 text-[#6B726D]" />
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 || totalHours === 0 ? (
          <div className="py-8 text-center text-xs text-[#6B726D]">
            No time distribution data available.
          </div>
        ) : (
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[220px_1fr]">
            <div className="relative h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="hours"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.map((item) => (
                      <Cell
                        key={item.taskType}
                        fill={categoryColors[item.taskType] ?? "#9CA3AF"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | string, _name, item) => [
                      `${Number(value)} hrs`,
                      item.payload.name,
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E5E7E5",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#171A18]">
                  {totalHours}
                </span>
                <span className="text-[11px] font-medium text-[#6B726D]">
                  Total Hours
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {data.map((item) => {
                const percentage = (item.hours / totalHours) * 100;

                return (
                  <div
                    key={item.taskType}
                    className="flex items-center justify-between rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            categoryColors[item.taskType] ?? "#9CA3AF",
                        }}
                      />
                      <span className="truncate text-xs font-semibold text-[#171A18]">
                        {item.name}
                      </span>
                    </div>

                    <Badge
                      variant="outline"
                      className="ml-3 shrink-0 border-[#E5E7E5] bg-white text-[10px] font-semibold text-[#6B726D]"
                    >
                      {item.hours} hrs · {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}