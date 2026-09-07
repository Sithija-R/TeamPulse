import { useEffect, useMemo } from "react";

import { Link } from "react-router-dom";

import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileText,
  PlusCircle,
} from "lucide-react";

import { PageHeader } from "../../components/common/PageHeader";
import { CorrectionFeedback } from "../../components/reports/CorrectionFeedback";
import { useAuthStore } from "../../store/authStore";
import { useReportStore } from "../../store/reportStore";
import { useReviewStore } from "../../store/reviewStore";
import { formatDate } from "../../lib/utils";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getCurrentWeek = () => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(0, 0, 0, 0);

  const toDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return {
    startDate: toDateString(monday),
    endDate: toDateString(sunday),
  };
};

const getStatusClassName = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "border-[#8DF688] bg-[#8DF688]/20 text-[#171A18]";

    case "SUBMITTED":
      return "border-[#E5E7E5] bg-[#F7F8F7] text-[#171A18]";

    case "NEEDS_CORRECTION":
      return "border-[#B86B6B] bg-[#B86B6B]/10 text-[#171A18]";

    case "DRAFT":
      return "border-[#E5E7E5] bg-white text-[#6B726D]";

    default:
      return "border-[#E5E7E5] bg-white text-[#6B726D]";
  }
};

const getStatusLabel = (status: string) =>
  status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getActionForStatus = (status: string, id: number) => {
  switch (status) {
    case "DRAFT":
      return {
        label: "Continue Editing",
        icon: Edit,
        href: `/user/reports/${id}/edit`,
      };

    case "NEEDS_CORRECTION":
      return {
        label: "Review & Fix",
        icon: Edit,
        href: `/user/reports/${id}/edit`,
      };

    case "SUBMITTED":
    case "APPROVED":
      return {
        label: "View Report",
        icon: Eye,
        href: `/user/reports/${id}`,
      };

    default:
      return {
        label: "View Report",
        icon: Eye,
        href: `/user/reports/${id}`,
      };
  }
};

export default function UserDashboard() {
  const { authUser } = useAuthStore();

  const {
    reports,
    isLoading: reportsLoading,
    error: reportsError,
    fetchMyReports,
  } = useReportStore();

  const { reviews, isLoading: reviewsLoading, fetchReviews } = useReviewStore();

  const currentWeek = useMemo(() => getCurrentWeek(), []);

  useEffect(() => {
    fetchMyReports();
  }, [fetchMyReports]);

  const currentWeekReport = useMemo(
    () =>
      reports.find((report) => report.weekStartDate === currentWeek.startDate),
    [reports, currentWeek.startDate]
  );

  useEffect(() => {
    if (currentWeekReport?.status === "NEEDS_CORRECTION") {
      fetchReviews(currentWeekReport.id);
    }
  }, [currentWeekReport, fetchReviews]);

  const currentReview = reviews[0];

  const metrics = useMemo(() => {
    if (!currentWeekReport) {
      return {
        completedTasks: 0,
        totalTasks: 0,
        actualHours: 0,
        openBlockers: 0,
      };
    }

    return {
      completedTasks: currentWeekReport.tasks.filter(
        (task) => task.status === "COMPLETED"
      ).length,

      totalTasks: currentWeekReport.tasks.length,

      actualHours: currentWeekReport.timeEntries.reduce(
        (total, entry) => total + Number(entry.hours || 0),
        0
      ),

      openBlockers: currentWeekReport.blockers.filter(
        (blocker) => !blocker.resolved
      ).length,
    };
  }, [currentWeekReport]);

  const action = currentWeekReport
    ? getActionForStatus(currentWeekReport.status, currentWeekReport.id)
    : {
        label: "Create Weekly Report",
        icon: PlusCircle,
        href: "/user/reports/create",
      };

  const ActionIcon = action.icon;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${authUser?.name ?? "Team Member"}!`}
        description="Track your weekly progress, reports, and outstanding work."
      />

      {reportsError && (
        <Alert className="border border-red-300 bg-red-100 text-red-900 shadow-sm">
          <AlertTriangle className="h-4 w-4 text-red-700" />

          <AlertTitle className="text-red-900">
            Unable to load reports
          </AlertTitle>

          <AlertDescription className="text-black">
            {reportsError}
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[#E5E7E5] bg-[#F7F8F7]">
              <Calendar className="h-5 w-5 text-[#171A18]" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                Current Reporting Week
              </p>

              <p className="mt-1 text-base font-bold text-[#171A18]">
                {formatDate(currentWeek.startDate)} –{" "}
                {formatDate(currentWeek.endDate)}
              </p>

              <p className="mt-1 text-xs text-[#6B726D]">
                Your weekly progress for the current reporting period.
              </p>
            </div>
          </div>

          <Button
            render={<Link to={action.href} />}
            className="w-full border-0 bg-[#8DF688] text-[#171A18] hover:bg-[#7ae875] sm:w-auto"
          >
            <ActionIcon className="h-4 w-4" />
            {action.label}
          </Button>
        </CardContent>
      </Card>

      {currentWeekReport?.status === "NEEDS_CORRECTION" && (
        <div>
          {reviewsLoading ? (
            <Card className="border-[#E5E7E5] bg-white shadow-sm">
              <CardContent className="p-5">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </CardContent>
            </Card>
          ) : currentReview ? (
            <CorrectionFeedback review={currentReview} />
          ) : null}
        </div>
      )}

      {reportsLoading && reports.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-[#E5E7E5] bg-white shadow-sm">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-8 w-16" />
                <Skeleton className="mt-2 h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-[#8DF688] bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                  Completed Tasks
                </p>

                <CheckCircle2 className="h-4 w-4 text-[#85e580]" />
              </div>

              <p className="mt-3 text-3xl font-bold text-[#171A18]">
                {metrics.completedTasks}
              </p>

              <p className="mt-1 text-xs text-[#6B726D]">
                of {metrics.totalTasks} total tasks
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[#88caf6] bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                  Actual Hours
                </p>

                <Clock className="h-4 w-4 text-[#88B6F6]" />
              </div>

              <p className="mt-3 text-3xl font-bold text-[#171A18]">
                {metrics.actualHours}
              </p>

              <p className="mt-1 text-xs text-[#6B726D]">
                hours recorded this week
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[#f68888] bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                  Open Blockers
                </p>

                <AlertTriangle className="h-4 w-4 text-[#f68888]" />
              </div>

              <p className="mt-3 text-3xl font-bold text-[#171A18]">
                {metrics.openBlockers}
              </p>

              <p className="mt-1 text-xs text-[#6B726D]">unresolved blockers</p>
            </CardContent>
          </Card>

          <Card
            className={`border bg-white shadow-sm ${
              currentWeekReport
                ? currentWeekReport.status === "APPROVED"
                  ? "border-[#8DF688]"
                  : currentWeekReport.status === "NEEDS_CORRECTION"
                  ? "border-[#f6d988]"
                  : currentWeekReport.status === "SUBMITTED"
                  ? "border-[#f68888]"
                  : "border-[#E5E7E5]"
                : "border-[#E5E7E5]"
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                  Report Status
                </p>

                <FileText className="h-4 w-4 text-[#171A18]" />
              </div>

              <div className="mt-4">
                {currentWeekReport ? (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      currentWeekReport.status === "APPROVED"
                        ? "border-[#8DF688] bg-[#8DF688]/20 text-[#171A18]"
                        : currentWeekReport.status === "NEEDS_CORRECTION"
                        ? "border-[#f6d988] bg-[#f6d988]/20 text-[#171A18]"
                        : currentWeekReport.status === "SUBMITTED"
                        ? "border-[#f68888] bg-[#f68888]/20 text-[#171A18]"
                        : "border-[#E5E7E5] bg-[#F7F8F7] text-[#6B726D]"
                    }`}
                  >
                    {getStatusLabel(currentWeekReport.status)}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-[#E5E7E5] bg-[#F7F8F7] text-xs text-[#6B726D]"
                  >
                    Not Created
                  </Badge>
                )}
              </div>

              <p className="mt-2 text-xs text-[#6B726D]">
                Current week's report
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b-[#E5E7E5]">
          <div>
            <CardTitle className="text-base font-bold text-[#171A18]">
              Current Week Overview
            </CardTitle>

            <p className="mt-1 text-xs text-[#6B726D]">
              Your report activity for this reporting period.
            </p>
          </div>

          {currentWeekReport && (
            <Button
              variant="ghost"
              size="sm"
              render={<Link to={`/user/reports/${currentWeekReport.id}`} />}
              className="text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
            >
              View Report
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-5">
          {!currentWeekReport ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-dashed border-[#E5E7E5] bg-[#F7F8F7] px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <FileText className="h-5 w-5 text-[#6B726D]" />
              </div>

              <h3 className="mt-4 text-sm font-bold text-[#171A18]">
                No report for this week
              </h3>

              <p className="mt-1 max-w-md text-xs text-[#6B726D]">
                You haven't created your weekly report yet. Start documenting
                your progress for this reporting period.
              </p>

              <Button
                className="mt-4 border-0 bg-[#8DF688] text-[#171A18] hover:bg-[#7ae875]"
                render={<Link to="/user/reports/create" />}
              >
                <PlusCircle className="h-4 w-4" />
                Create Weekly Report
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                  Project
                </p>

                <p className="mt-1 text-sm font-bold text-[#171A18]">
                  {currentWeekReport.projectName}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                  Status
                </p>

                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className={getStatusClassName(currentWeekReport.status)}
                  >
                    {getStatusLabel(currentWeekReport.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                  Tasks
                </p>

                <p className="mt-1 text-sm font-semibold text-[#171A18]">
                  {metrics.completedTasks} completed{" "}
                  <span className="font-normal text-[#6B726D]">
                    / {metrics.totalTasks} total
                  </span>
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                  Time Logged
                </p>

                <p className="mt-1 text-sm font-semibold text-[#171A18]">
                  {metrics.actualHours} hours
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B726D]">
                  Next Week Tasks
                </p>

                <p className="mt-1 text-sm leading-6 text-[#6B726D]">
                  {currentWeekReport.nextWeekTasks ||
                    "No next-week tasks have been added yet."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b-[#E5E7E5]">
          <div>
            <CardTitle className="text-base font-bold text-[#171A18]">
              Recent Reports
            </CardTitle>

            <p className="mt-1 text-xs text-[#6B726D]">
              Your previously submitted and saved weekly reports.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            render={<Link to="/user/reports" />}
            className="text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {reports.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <FileText className="mx-auto h-8 w-8 text-[#6B726D]" />

              <p className="mt-3 text-sm font-semibold text-[#171A18]">
                No reports found
              </p>

              <p className="mt-1 text-xs text-[#6B726D]">
                Your weekly reports will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E5E7E5] hover:bg-transparent">
                    <TableHead className="pl-5 text-xs font-semibold text-[#6B726D]">
                      Week
                    </TableHead>

                    <TableHead className="text-xs font-semibold text-[#6B726D]">
                      Project
                    </TableHead>

                    <TableHead className="text-xs font-semibold text-[#6B726D]">
                      Status
                    </TableHead>

                    <TableHead className="text-right text-xs font-semibold text-[#6B726D]">
                      Tasks
                    </TableHead>

                    <TableHead className="pr-5 text-right text-xs font-semibold text-[#6B726D]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {reports.map((report) => {
                    const reportAction = getActionForStatus(
                      report.status,
                      report.id
                    );

                    const ReportActionIcon = reportAction.icon;

                    const completedTasks = report.tasks.filter(
                      (task) => task.status === "COMPLETED"
                    ).length;

                    return (
                      <TableRow
                        key={report.id}
                        className="border-[#E5E7E5] hover:bg-[#F7F8F7]"
                      >
                        <TableCell className="whitespace-nowrap pl-5 text-sm font-medium text-[#171A18]">
                          {formatDate(report.weekStartDate)}
                        </TableCell>

                        <TableCell className="max-w-[220px] truncate text-sm text-[#6B726D]">
                          {report.projectName}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusClassName(report.status)}
                          >
                            {getStatusLabel(report.status)}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right text-sm text-[#6B726D]">
                          {completedTasks}/{report.tasks.length}
                        </TableCell>

                        <TableCell className="pr-5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            render={<Link to={reportAction.href} />}
                            className="text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
                          >
                            <ReportActionIcon className="h-3.5 w-3.5" />

                            <span className="hidden sm:inline">
                              {reportAction.label}
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
