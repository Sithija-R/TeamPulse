import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Edit, Eye, Filter, PlusCircle, Search } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { formatDate } from "../../../lib/utils";
import { useReportStore } from "../../../store/reportStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MyReports() {
  const { reports, isLoading, error, fetchMyReports } = useReportStore();
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMyReports();
  }, [fetchMyReports]);

  const projects = useMemo(() => {
    const uniqueProjects = new Map<number, string>();
    reports.forEach((report) => {
      uniqueProjects.set(report.projectId, report.projectName);
    });
    return Array.from(uniqueProjects.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (projectFilter !== "ALL" && report.projectId !== Number(projectFilter)) return false;
      if (statusFilter !== "ALL" && report.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchProject = report.projectName.toLowerCase().includes(query);
        const matchTasks = report.tasks.some((task) => task.taskName.toLowerCase().includes(query));
        if (!matchProject && !matchTasks) return false;
      }

      return true;
    });
  }, [reports, projectFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Weekly Reports"
        description="Manage and track your weekly status reports and revision requests."
        action={
          <Button
            render={<Link to="/user/reports/create" />}
            className="rounded-xl bg-[#8DF688] px-4 text-xs font-bold text-[#171A18] shadow-xs hover:bg-[#7ae875]"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Report
          </Button>
        }
      />

      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B726D]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project or task keyword..."
              className="h-9 border-[#E5E7E5] bg-[#F7F8F7] pl-9 text-xs text-[#171A18] placeholder:text-[#6B726D] focus-visible:ring-[#8DF688]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#6B726D]">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters:</span>
            </div>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="h-9 w-[170px] border-[#E5E7E5] bg-[#F7F8F7] text-xs font-semibold text-[#171A18]">
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[170px] border-[#E5E7E5] bg-[#F7F8F7] text-xs font-semibold text-[#171A18]">
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
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-xs font-medium text-red-700">{error}</CardContent>
        </Card>
      )}

      <Card className="overflow-hidden border-[#E5E7E5] bg-white shadow-sm">
        {isLoading && reports.length === 0 ? (
          <CardContent className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="ml-auto h-8 w-24" />
              </div>
            ))}
          </CardContent>
        ) : filteredReports.length === 0 ? (
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F8F7]">
              <Search className="h-4 w-4 text-[#6B726D]" />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#171A18]">No reports found</p>
            <p className="mt-1 text-xs text-[#6B726D]">No reports match your selected criteria.</p>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#E5E7E5] bg-[#F7F8F7] hover:bg-[#F7F8F7]">
                  <TableHead className="px-4 text-xs font-semibold text-[#6B726D]">Week Start – End</TableHead>
                  <TableHead className="px-4 text-xs font-semibold text-[#6B726D]">Project Name</TableHead>
                  <TableHead className="px-3 text-xs font-semibold text-[#6B726D]">Status</TableHead>
                  <TableHead className="px-3 text-xs font-semibold text-[#6B726D]">Tasks</TableHead>
                  <TableHead className="px-3 text-xs font-semibold text-[#6B726D]">Submitted Date</TableHead>
                  <TableHead className="px-4 text-right text-xs font-semibold text-[#6B726D]">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="border-[#E5E7E5] transition-colors hover:bg-[#F7F8F7]/50">
                    <TableCell className="whitespace-nowrap px-4 py-3.5 text-xs font-bold text-[#171A18]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#6B726D]" />
                        {formatDate(report.weekStartDate)} – {formatDate(report.weekEndDate)}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-xs font-medium text-[#6B726D]">
                      {report.projectName}
                    </TableCell>

                    <TableCell className="px-3 py-3.5">
                      <StatusBadge status={report.status} type="report" size="sm" />
                    </TableCell>

                    <TableCell className="px-3 py-3.5 text-xs font-semibold text-[#171A18]">
                      {report.tasks.length} tasks
                    </TableCell>

                    <TableCell className="px-3 py-3.5 text-xs text-[#6B726D]">
                      {report.submittedAt ? formatDate(report.submittedAt) : "Not submitted"}
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          render={<Link to={`/user/reports/${report.id}`} />}
                          className="h-8 rounded-md border-[#E5E7E5] px-2.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#6B726D]" />
                          <span className="hidden sm:inline">View</span>
                        </Button>

                        {(report.status === "DRAFT" || report.status === "NEEDS_CORRECTION") && (
                          <Button
                            variant="outline"
                            size="sm"
                            render={<Link to={`/user/reports/${report.id}/edit`} />}
                            className="h-8 rounded-md border-amber-200 bg-amber-50 px-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}