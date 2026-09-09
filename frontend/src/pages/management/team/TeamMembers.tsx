import { useEffect } from "react";
import { ChevronRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "../../../components/common/PageHeader";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { useDashboardStore } from "../../../store/dashboardStore";

import { Card, CardContent } from "@/components/ui/card";

export function TeamMembers() {
  const { dashboard, isLoading, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const memberStatuses = dashboard?.statusByMember ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Members Directory"
        description="Monitor individual reporting status and current project assignments."
      />

      {isLoading ? (
        <Card className="border-[#E5E7E5] shadow-none">
          <CardContent className="p-10 text-center text-sm text-[#6B726D]">
            Loading team members...
          </CardContent>
        </Card>
      ) : memberStatuses.length === 0 ? (
        <Card className="border-dashed border-[#E5E7E5] shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7E5] bg-[#F7F8F7]">
              <Shield className="h-5 w-5 text-[#6B726D]" />
            </div>
            <h3 className="text-sm font-bold text-[#171A18]">
              No team members found
            </h3>
            <p className="mt-1 max-w-sm text-xs text-[#6B726D]">
              There are currently no team members available.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memberStatuses.map((member) => (
            <Card
              key={member.memberId}
              className="border-[#E5E7E5] bg-white shadow-xs transition-all hover:border-[#171A18] hover:shadow-md"
            >
              <Link
                to={`/management/team/${member.memberId}`}
                className="group block"
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#171A18] text-sm font-bold text-white">
                        {member.memberName.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#171A18] group-hover:underline">
                          {member.memberName}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-[#6B726D]">
                          {member.reportCount}{" "}
                          {member.reportCount === 1 ? "report" : "reports"}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-[#9AA19C] transition-colors group-hover:text-[#171A18]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-[#E5E7E5] pt-3">
                    <div className="min-w-0">
                      <span className="block text-[10px] text-[#6B726D]">
                        Project
                      </span>
                      <span className="block truncate text-xs font-semibold text-[#171A18]">
                        {member.projectName || "No Project"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] text-[#6B726D]">
                        Current Status
                      </span>
                      <StatusBadge
                        status={member.status}
                        type="report"
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-[#E5E7E5] pt-3">
                    <div className="rounded-lg bg-[#F7F8F7] px-2 py-2 text-center">
                      <span className="block text-[10px] text-[#6B726D]">
                        Tasks
                      </span>
                      <span className="text-xs font-bold text-[#171A18]">
                        {member.totalTasks}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#F7F8F7] px-2 py-2 text-center">
                      <span className="block text-[10px] text-[#6B726D]">
                        Completed
                      </span>
                      <span className="text-xs font-bold text-[#171A18]">
                        {member.completedTasks}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#F7F8F7] px-2 py-2 text-center">
                      <span className="block text-[10px] text-[#6B726D]">
                        Blockers
                      </span>
                      <span className="text-xs font-bold text-[#171A18]">
                        {member.openBlockers}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-[11px] font-medium text-[#171A18]">
                    <Shield className="h-3 w-3 text-[#8DF688]" />
                    Team Member
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}