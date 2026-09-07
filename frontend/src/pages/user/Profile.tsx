import { useEffect, useMemo } from "react";
import { Award, CheckCircle2, Clock, Mail, Shield } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { formatDate } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";
import { useReportStore } from "../../store/reportStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Profile = () => {
  const { authUser } = useAuthStore();
  const {
    reports,
    isLoading,
    error,
    fetchMyReports,
  } = useReportStore();

  useEffect(() => {
    fetchMyReports();
  }, [fetchMyReports]);

  const approvedCount = useMemo(
    () => reports.filter((report) => report.status === "APPROVED").length,
    [reports]
  );

  const submittedCount = useMemo(
    () =>
      reports.filter(
        (report) =>
          report.status === "SUBMITTED" || report.status === "APPROVED"
      ).length,
    [reports]
  );

  const totalHours = useMemo(
    () =>
      reports.reduce(
        (reportTotal, report) =>
          reportTotal +
          report.timeEntries.reduce(
            (entryTotal, entry) => entryTotal + Number(entry.hours || 0),
            0
          ),
        0
      ),
    [reports]
  );

  const initials = authUser?.name
    ? authUser.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Profile"
        description="View account preferences, departmental role, and report performance history."
      />

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-xs font-medium text-red-700">
            {error}
          </CardContent>
        </Card>
      )}

      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 border-b border-[#E5E7E5] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#171A18] text-xl font-bold text-white">
                {initials}
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#171A18]">
                  {authUser?.name ?? "User"}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6B726D]">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{authUser?.email ?? "No email available"}</span>
                  <span>•</span>
                  <Shield className="h-3.5 w-3.5 text-[#8DF688]" />
                  <span className="font-semibold text-[#171A18]">
                    {authUser?.role ?? "USER"}
                  </span>
                </div>
              </div>
            </div>

            <Badge className="w-fit rounded-full border border-[#8DF688] bg-[#8DF688]/20 px-3.5 py-1 text-xs font-bold text-[#171A18] hover:bg-[#8DF688]/20">
              95% Compliance Rate
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
            <Card className="border-[#E5E7E5] bg-[#F7F8F7] shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <Award className="h-5 w-5 text-emerald-600" />
                <div>
                  <span className="block text-[#6B726D]">
                    Approved Weekly Reports
                  </span>
                  <span className="text-lg font-bold text-[#171A18]">
                    {approvedCount} Reports
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7E5] bg-[#F7F8F7] shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="block text-[#6B726D]">
                    Total Submissions
                  </span>
                  <span className="text-lg font-bold text-[#171A18]">
                    {submittedCount} Reports
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7E5] bg-[#F7F8F7] shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <Clock className="h-5 w-5 text-[#171A18]" />
                <div>
                  <span className="block text-[#6B726D]">
                    Total Hours Logged
                  </span>
                  <span className="text-lg font-bold text-[#171A18]">
                    {totalHours} Hours
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardHeader className="border-b border-[#E5E7E5]">
          <CardTitle className="text-base font-bold text-[#171A18]">
            Reporting History & Submissions
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading && reports.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="border-[#E5E7E5] shadow-none">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D9DDD9] bg-[#F7F8F7] p-8 text-center">
              <FileTextIcon />
              <p className="mt-3 text-sm font-semibold text-[#171A18]">
                No reporting history
              </p>
              <p className="mt-1 text-xs text-[#6B726D]">
                Your weekly reports will appear here once you create them.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <Card
                  key={report.id}
                  className="border-[#E5E7E5] bg-[#F7F8F7]/50 shadow-none transition-colors hover:border-[#171A18]"
                >
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#171A18]">
                        {report.projectName}
                      </div>

                      <div className="mt-0.5 text-xs text-[#6B726D]">
                        Week: {formatDate(report.weekStartDate)} –{" "}
                        {formatDate(report.weekEndDate)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge
                        status={report.status}
                        type="report"
                        size="sm"
                      />

                      <span className="hidden text-xs font-medium text-[#6B726D] sm:inline">
                        {report.tasks.length} tasks
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const FileTextIcon = () => (
  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4 text-[#6B726D]"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  </div>
);