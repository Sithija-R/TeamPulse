import {
  Calendar,
  User,
  Briefcase,
  CheckSquare,
  AlertTriangle,
  Trophy,
  Clock,
  StickyNote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "../common/StatusBadge";
import { ReportTaskTable } from "./ReportTaskTable";
import { formatDate, formatDateTime } from "../../lib/utils";
import { TASK_TYPE_LABELS } from "../../lib/constants";
import type { WeeklyReport } from "../../types/report";

interface ReportSummaryProps {
  report: WeeklyReport;
}

function formatReportDateTime(value: string) {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return formatDateTime(value);
  }

  if (/^\d{18}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 5).padStart(2, "0");
    const day = value.slice(5, 6).padStart(2, "0");
    const hour = value.slice(6, 8);
    const minute = value.slice(8, 10);
    const second = value.slice(10, 12);
    const milliseconds = value.slice(12, 15);

    return formatDateTime(
      `${year}-${month}-${day}T${hour}:${minute}:${second}.${milliseconds}`
    );
  }

  return value;
}

export function ReportSummary({ report }: ReportSummaryProps) {
  const totalHours = report.timeEntries.reduce(
    (total, entry) => total + entry.hours,
    0
  );


  return (
    <div className="space-y-6">
      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-bold text-[#171A18]">
                  {report.projectName}
                </CardTitle>
                <StatusBadge status={report.status} type="report" size="md" />
              </div>
              <p className="mt-1 text-xs text-[#6B726D]">
                Weekly Report &bull; {formatDate(report.weekStartDate)} &ndash;{" "}
                {formatDate(report.weekEndDate)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {report.submittedAt && (
                <Badge
                  variant="outline"
                  className="rounded-lg border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs font-medium text-[#6B726D]"
                >
                  Submitted:{" "}
                  <span className="font-bold text-[#171A18]">
                    {formatReportDateTime(report.submittedAt)}
                  </span>
                </Badge>
              )}
              {report.approvedAt && (
                <Badge
                  variant="outline"
                  className="rounded-lg border-[#8DF688] bg-[#8DF688]/20 px-3 py-1.5 text-xs font-semibold text-[#171A18]"
                >
                  Approved: {formatReportDateTime(report.approvedAt)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] p-3">
              <User className="h-4 w-4 text-[#6B726D]" />
              <div>
                <span className="block text-[11px] text-[#6B726D]">
                  Submitted By
                </span>
                <span className="font-bold text-[#171A18]">
                  {report.userName}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] p-3">
              <Briefcase className="h-4 w-4 text-[#6B726D]" />
              <div>
                <span className="block text-[11px] text-[#6B726D]">
                  Project Workspace
                </span>
                <span className="font-bold text-[#171A18]">
                  {report.projectName}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] p-3">
              <Clock className="h-4 w-4 text-[#6B726D]" />
              <div>
                <span className="block text-[11px] text-[#6B726D]">
                  Logged Time
                </span>
                <span className="font-bold text-[#171A18]">
                  {totalHours} Hours Total
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-[#171A18]">
            <CheckSquare className="h-4 w-4" />
            Completed Tasks & Deliverables
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <ReportTaskTable tasks={report.tasks} isEditable={false} />
        </CardContent>
      </Card>

      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-[#171A18]">
            <Calendar className="h-4 w-4" />
            Planned Tasks for Next Week
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {report.nextWeekTasks ? (
            <div className="rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] p-4 text-xs font-medium leading-relaxed whitespace-pre-line text-[#171A18]">
              {report.nextWeekTasks}
            </div>
          ) : (
            <p className="text-xs italic text-[#9AA19C]">
              No next week plans recorded.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-[#E5E7E5] bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-[#171A18]">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Blockers & Impediments
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {report.blockers.length === 0 ? (
              <p className="text-xs italic text-[#9AA19C]">
                No blockers encountered this week.
              </p>
            ) : (
              <div className="space-y-2">
                {report.blockers.map((blocker) => (
                  <div
                    key={blocker.id}
                    className={`rounded-lg border p-3 text-xs ${
                      blocker.keyIssue
                        ? "border-rose-200 bg-rose-50 text-rose-900"
                        : "border-amber-200 bg-amber-50 text-amber-900"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>
                        {blocker.keyIssue ? "⚠️ KEY ISSUE" : "Blocker"}
                      </span>
                      <span>
                        {blocker.resolved ? "✓ Resolved" : "Pending Resolution"}
                      </span>
                    </div>
                    <p className="mt-1 font-medium">{blocker.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#E5E7E5] bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-[#171A18]">
              <Trophy className="h-4 w-4 text-[#171A18]" />
              Key Achievements
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {report.achievements.length === 0 ? (
              <p className="text-xs italic text-[#9AA19C]">
                No highlights recorded.
              </p>
            ) : (
              <div className="space-y-2">
                {report.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border p-3 text-xs ${
                      achievement.keyAchievement
                        ? "border-[#8DF688] bg-[#8DF688]/20 text-[#171A18]"
                        : "border-[#E5E7E5] bg-[#F7F8F7] text-[#171A18]"
                    }`}
                  >
                    <p className="font-semibold">{achievement.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-[#E5E7E5] bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-[#171A18]">
                <Clock className="h-4 w-4" />
                Time Breakdown
              </CardTitle>
              <Badge
                variant="outline"
                className="border-[#E5E7E5] bg-[#F7F8F7] text-xs font-bold text-[#171A18]"
              >
                {totalHours} Hours Logged
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {report.timeEntries.length === 0 ? (
              <p className="text-xs italic text-[#9AA19C]">
                No time entries recorded.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {report.timeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] p-2.5 text-xs"
                  >
                    <span className="block text-[11px] text-[#6B726D]">
                      {TASK_TYPE_LABELS[entry.taskType]}
                    </span>
                    <span className="font-bold text-[#171A18]">
                      {entry.hours} hrs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#E5E7E5] bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-[#171A18]">
              <StickyNote className="h-4 w-4" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {report.notes ? (
              <p className="rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] p-3 text-xs font-medium leading-relaxed text-[#171A18]">
                {report.notes}
              </p>
            ) : (
              <p className="text-xs italic text-[#9AA19C]">
                No additional notes provided.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}