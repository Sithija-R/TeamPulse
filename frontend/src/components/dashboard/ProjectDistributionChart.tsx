import { Briefcase } from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectDistributionChartProps {
  projects: Record<string, number>;
}

const projectColors = [
  "#8DF688",
  "#60A5FA",
  "#FBBF24",
  "#F472B6",
  "#A78BFA",
  "#34D399",
  "#FB923C",
  "#22D3EE",
  "#F87171",
  "#818CF8",
];

function getBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const radius = Math.min(width / 2, 8);

  return `
    M ${x} ${y + height}
    L ${x} ${y + radius}
    Q ${x} ${y} ${x + radius} ${y}
    L ${x + width - radius} ${y}
    Q ${x + width} ${y} ${x + width} ${y + radius}
    L ${x + width} ${y + height}
    Z
  `;
}

function CustomBar(props: BarShapeProps) {
  const { x, y, width, height, index } = props;

  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  ) {
    return null;
  }

  const color =
    projectColors[(index ?? 0) % projectColors.length];

  return (
    <path
      d={getBarPath(x, y, width, height)}
      fill={color}
      className="transition-opacity duration-200 hover:opacity-80"
    />
  );
}

export function ProjectDistributionChart({
  projects,
}: ProjectDistributionChartProps) {
  const chartData = Object.entries(projects).map(
    ([projectName, reportCount]) => ({
      projectName,
      reportCount,
    }),
  );

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
        {chartData.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6B726D]">
            No project data available.
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#E5E7E5"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="projectName"
                  tick={{
                    fontSize: 10,
                    fill: "#6B726D",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 10,
                    fill: "#6B726D",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: "#F7F8F7" }}
                  contentStyle={{
                    border: "1px solid #E5E7E5",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="reportCount"
                  shape={CustomBar}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}