import { useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  Clock,
  Eye,
  Mail,
  Shield,
} from "lucide-react";

import { PageHeader } from "../../../components/common/PageHeader";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { ErrorState } from "../../../components/common/ErrorState";
import { useDashboardStore } from "../../../store/dashboardStore";
import { useReportStore } from "../../../store/reportStore";
import { useUserStore } from "../../../store/userStore";
import { formatDate } from "../../../lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function getCurrentWeekStart(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  return [
    monday.getFullYear(),
    String(monday.getMonth() + 1).padStart(2, "0"),
    String(monday.getDate()).padStart(2, "0"),
  ].join("-");
}

const roleLabels: Record<string, string> = {
  TEAM_MEMBER: "Team Member",
  MANAGER: "Manager",
  ADMIN: "Administrator",
};

export function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = Number(id);

  const {
    selectedUser,
    isLoading: isUserLoading,
    error: userError,
    fetchUser,
  } = useUserStore();

  const {
    dashboard,
    isLoading: isDashboardLoading,
    fetchDashboard,
  } = useDashboardStore();

  const {
    reports,
    isLoading: isReportsLoading,
    error: reportError,
    fetchAllReports,
  } = useReportStore();

  useEffect(() => {
    if (!id || Number.isNaN(userId)) return;

    const weekStartDate = getCurrentWeekStart();

    fetchUser(userId);
    fetchDashboard(weekStartDate);
    fetchAllReports();
  }, [id, userId, fetchUser, fetchDashboard, fetchAllReports]);

  const member = selectedUser;

  const memberReports = useMemo(
    () => reports.filter((report) => report.userId === userId),
    [reports, userId],
  );

  const memberStatus = useMemo(
    () => dashboard?.statusByMember.find((item) => item.memberId === userId),
    [dashboard, userId],
  );

  const currentWeekStart = getCurrentWeekStart();

  const currentReport = memberReports.find(
    (report) => report.weekStartDate === currentWeekStart,
  );

  const approvedCount = memberReports.filter(
    (report) => report.status === "APPROVED",
  ).length;

  const totalHours = memberReports.reduce(
    (total, report) =>
      total +
      report.timeEntries.reduce(
        (reportTotal, entry) => reportTotal + entry.hours,
        0,
      ),
    0,
  );

  const isLoading =
    isUserLoading || isDashboardLoading || isReportsLoading;

  if (!id || Number.isNaN(userId)) {
    return (
      <ErrorState
        title="Member Not Found"
        message="The requested team member profile does not exist."
        onRetry={() => navigate("/management/team")}
      />
    );
  }

  if (isLoading && !member) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Member Profile"
          description="Loading team member information..."
        />

        <Card className="border-[#E5E7E5] bg-white shadow-none">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-4 border-b border-[#E5E7E5] pb-6">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!member || userError) {
    return (
      <ErrorState
        title="Member Not Found"
        message={userError || "The requested team member profile does not exist."}
        onRetry={() => navigate("/management/team")}
      />
    );
  }

  if (reportError && !isReportsLoading) {
    return (
      <ErrorState
        title="Unable to Load Reports"
        message={reportError}
        onRetry={() => fetchAllReports()}
      />
    );
  }

  const complianceRate = dashboard?.complianceRate ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Member Profile • ${member.name}`}
        description={`${roleLabels[member.role] || member.role} • ${member.email}`}
        breadcrumbs={[
          { label: "Team Members", href: "/management/team" },
          { label: member.name },
        ]}
      />

      <Card className="border-[#E5E7E5] bg-white shadow-none">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 border-b border-[#E5E7E5] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#171A18] text-xl font-bold text-white">
                {member.name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#171A18]">
                  {member.name}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6B726D]">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{member.email}</span>
                  <span>•</span>
                  <Shield className="h-3.5 w-3.5 text-[#8DF688]" />
                  <span className="font-semibold text-[#171A18]">
                    {roleLabels[member.role] || member.role}
                  </span>
                </div>
              </div>
            </div>

            <Badge className="w-fit rounded-full border border-[#8DF688] bg-[#8DF688]/20 px-3.5 py-1 text-xs font-bold text-[#171A18] hover:bg-[#8DF688]/20">
              {memberStatus?.reportCount ?? memberReports.length} Reports
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
            <Card className="border-[#E5E7E5] bg-[#F7F8F7] shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <Award className="h-5 w-5 text-emerald-600" />
                <div>
                  <span className="block text-[#6B726D]">
                    Current Week Status
                  </span>
                  <div className="mt-1">
                    <StatusBadge
                      status={currentReport?.status || memberStatus?.status || "NOT_STARTED"}
                      type="report"
                      size="sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7E5] bg-[#F7F8F7] shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="block text-[#6B726D]">
                    Approved Submissions
                  </span>
                  <span className="text-lg font-bold text-[#171A18]">
                    {approvedCount} Reports
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7E5] bg-[#F7F8F7] shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <Clock className="h-5 w-5 text-[#171A18]" />
                <div>
                  <span className="block text-[#6B726D]">
                    Logged Hours
                  </span>
                  <span className="text-lg font-bold text-[#171A18]">
                    {totalHours} Hours
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[#E5E7E5] pt-4 sm:grid-cols-4">
            <div className="rounded-xl border border-[#E5E7E5] bg-white p-3 text-center">
              <span className="block text-[10px] text-[#6B726D]">
                Compliance
              </span>
              <span className="text-lg font-bold text-[#171A18]">
                {complianceRate}%
              </span>
            </div>

            <div className="rounded-xl border border-[#E5E7E5] bg-white p-3 text-center">
              <span className="block text-[10px] text-[#6B726D]">
                Total Tasks
              </span>
              <span className="text-lg font-bold text-[#171A18]">
                {memberStatus?.totalTasks ?? 0}
              </span>
            </div>

            <div className="rounded-xl border border-[#E5E7E5] bg-white p-3 text-center">
              <span className="block text-[10px] text-[#6B726D]">
                Completed
              </span>
              <span className="text-lg font-bold text-[#171A18]">
                {memberStatus?.completedTasks ?? 0}
              </span>
            </div>

            <div className="rounded-xl border border-[#E5E7E5] bg-white p-3 text-center">
              <span className="block text-[10px] text-[#6B726D]">
                Open Blockers
              </span>
              <span className="text-lg font-bold text-[#171A18]">
                {memberStatus?.openBlockers ?? 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E5E7E5] bg-white shadow-none">
        <CardContent className="space-y-4 p-6">
          <h3 className="border-b border-[#E5E7E5] pb-3 text-base font-bold text-[#171A18]">
            Member Submissions & History
          </h3>

          {memberReports.length === 0 ? (
            <p className="text-xs italic text-[#6B726D]">
              No reports recorded for this member yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7E5] bg-[#F7F8F7] text-[#6B726D]">
                    <th className="px-3 py-3 font-semibold">Week Period</th>
                    <th className="px-3 py-3 font-semibold">Project</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">
                      Submitted Date
                    </th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E5E7E5]">
                  {memberReports.map((report) => (
                    <tr
                      key={report.id}
                      className="transition-colors hover:bg-[#F7F8F7]/50"
                    >
                      <td className="px-3 py-3 font-bold text-[#171A18]">
                        {formatDate(report.weekStartDate)} –{" "}
                        {formatDate(report.weekEndDate)}
                      </td>

                      <td className="px-3 py-3 font-medium text-[#6B726D]">
                        {report.projectName}
                      </td>

                      <td className="px-3 py-3">
                        <StatusBadge
                          status={report.status}
                          type="report"
                          size="sm"
                        />
                      </td>

                      <td className="px-3 py-3 text-[#6B726D]">
                        {report.submittedAt
                          ? formatDate(report.submittedAt)
                          : "Not submitted"}
                      </td>

                      <td className="px-3 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 px-2 text-xs font-semibold text-[#171A18]"
                          render={
                            <Link
                              to={`/management/reports/${report.id}`}
                            />
                          }
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}