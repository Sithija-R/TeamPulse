import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, CheckSquare, Eye, Filter, Search } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { formatDate } from "../../../lib/utils";
import { useReportStore } from "../../../store/reportStore";
import type { ReportStatus } from "../../../types/report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function AllReports() {
  const { reports, isLoading, error, fetchAllReports } = useReportStore();
  const [memberFilter, setMemberFilter] = useState("ALL");
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const teamMembers = useMemo(() => {
    const members = new Map<number, string>();
    reports.forEach((report) => {
      if (!members.has(report.userId)) members.set(report.userId, report.userName);
    });
    return Array.from(members.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [reports]);

  const projects = useMemo(() => {
    const projectMap = new Map<number, string>();
    reports.forEach((report) => {
      if (!projectMap.has(report.projectId)) projectMap.set(report.projectId, report.projectName);
    });
    return Array.from(projectMap.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (memberFilter !== "ALL" && report.userId !== Number(memberFilter)) return false;
      if (projectFilter !== "ALL" && report.projectId !== Number(projectFilter)) return false;
      if (statusFilter !== "ALL" && report.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchUser = report.userName.toLowerCase().includes(query);
        const matchProject = report.projectName.toLowerCase().includes(query);
        const matchTasks = report.tasks.some((task) =>
          task.taskName.toLowerCase().includes(query)
        );
        if (!matchUser && !matchProject && !matchTasks) return false;
      }

      return true;
    });
  }, [reports, memberFilter, projectFilter, statusFilter, searchQuery]);

  if (isLoading && reports.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="All Weekly Team Reports"
          description="Filter, review, and approve team submissions across projects."
        />
        <div className="space-y-3 rounded-xl border border-[#E5E7E5] bg-white p-4">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error && reports.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="All Weekly Team Reports"
          description="Filter, review, and approve team submissions across projects."
        />
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Weekly Team Reports"
        description="Filter, review, and approve team submissions across projects."
      />

      <div className="flex flex-col gap-3 rounded-xl border border-[#E5E7E5] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B726D]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member, project, or task..."
            className="h-9 border-[#E5E7E5] bg-[#F7F8F7] pl-9 text-xs text-[#171A18] placeholder:text-[#8A908C] focus-visible:border-[#8DF688] focus-visible:ring-[#8DF688]/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#6B726D]">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          <Select value={memberFilter} onValueChange={(value) => setMemberFilter(value ?? "ALL")}>
            <SelectTrigger className="h-9 w-[150px] border-[#E5E7E5] bg-[#F7F8F7] text-xs font-semibold text-[#171A18]">
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Members</SelectItem>
              {teamMembers.map(([id, name]) => (
                <SelectItem key={id} value={String(id)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={(value) => setProjectFilter(value ?? "ALL")}>
            <SelectTrigger className="h-9 w-[150px] border-[#E5E7E5] bg-[#F7F8F7] text-xs font-semibold text-[#171A18]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Projects</SelectItem>
              {projects.map(([id, name]) => (
                <SelectItem key={id} value={String(id)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "ALL")}>
            <SelectTrigger className="h-9 w-[160px] border-[#E5E7E5] bg-[#F7F8F7] text-xs font-semibold text-[#171A18]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="NEEDS_CORRECTION">Needs Correction</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7E5] bg-white">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B726D]">
            No reports matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#E5E7E5] bg-[#F7F8F7] hover:bg-[#F7F8F7]">
                  <TableHead className="px-4 py-3 text-xs font-semibold text-[#6B726D]">
                    Team Member
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-[#6B726D]">
                    Project
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-[#6B726D]">
                    Week Period
                  </TableHead>
                  <TableHead className="px-3 py-3 text-xs font-semibold text-[#6B726D]">
                    Status
                  </TableHead>
                  <TableHead className="px-3 py-3 text-xs font-semibold text-[#6B726D]">
                    Submitted Date
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold text-[#6B726D]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="border-[#E5E7E5] transition-colors hover:bg-[#F7F8F7]/50"
                  >
                    <TableCell className="px-4 py-3.5 font-bold text-[#171A18]">
                      <Link
                        to={`/management/team/${report.userId}`}
                        className="hover:underline"
                      >
                        {report.userName}
                      </Link>
                    </TableCell>

                    <TableCell className="px-4 py-3.5 font-medium text-[#6B726D]">
                      {report.projectName}
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-[#171A18]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#6B726D]" />
                        {formatDate(report.weekStartDate)} – {formatDate(report.weekEndDate)}
                      </div>
                    </TableCell>

                    <TableCell className="px-3 py-3.5">
                      <StatusBadge
                        status={report.status as ReportStatus}
                        type="report"
                        size="sm"
                      />
                    </TableCell>

                    <TableCell className="px-3 py-3.5 text-[#6B726D]">
                      {report.submittedAt ? formatDate(report.submittedAt) : "—"}
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-right">
                      {report.status === "SUBMITTED" ? (
                        <Button
                          render={<Link to={`/management/reports/${report.id}/review`} />}
                          className="h-8 rounded-lg bg-[#8DF688] px-3 text-xs font-bold text-[#171A18] shadow-xs hover:bg-[#7ae875]"
                        >
                          <CheckSquare className="h-3.5 w-3.5" />
                          Review
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          render={<Link to={`/management/reports/${report.id}`} />}
                          className="h-8 rounded-lg border-[#E5E7E5] px-3 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#6B726D]" />
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}