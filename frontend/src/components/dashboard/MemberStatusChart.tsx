import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ExternalLink } from "lucide-react";

import { MemberStatus } from "../../types/dashboard";
import { StatusBadge } from "../common/StatusBadge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MemberStatusChartProps {
  statuses: MemberStatus[];
}

export const MemberStatusChart: React.FC<MemberStatusChartProps> = ({ statuses }) => {
  return (
    <Card className="border border-[#E5E7E5] bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-4">
        <div>
          <CardTitle className="text-sm font-bold text-[#171A18]">
            Team Submission Status
          </CardTitle>
          <p className="mt-1 text-xs text-[#6B726D]">
            Real-time reporting status per team member
          </p>
        </div>

        <Link
          to="/management/reports"
          className="flex items-center gap-1 text-xs font-semibold text-[#171A18] hover:underline"
        >
          View All Reports
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5E7E5] bg-[#F7F8F7] hover:bg-[#F7F8F7]">
                <TableHead className="font-semibold text-[#6B726D]">
                  Team Member
                </TableHead>
                <TableHead className="font-semibold text-[#6B726D]">
                  Project
                </TableHead>
                <TableHead className="font-semibold text-[#6B726D]">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-[#6B726D]">
                  Tasks
                </TableHead>
                <TableHead className="font-semibold text-[#6B726D]">
                  Blockers
                </TableHead>
                <TableHead className="text-right font-semibold text-[#6B726D]">
                  Reports
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {statuses.map((member) => (
                <TableRow
                  key={member.memberId}
                  className="border-[#E5E7E5] hover:bg-[#F7F8F7]/50"
                >
                  <TableCell>
                    <Link
                      to={`/management/team/${member.memberId}`}
                      className="font-medium text-[#171A18] hover:underline"
                    >
                      {member.memberName}
                    </Link>
                  </TableCell>

                  <TableCell className="font-medium text-[#6B726D]">
                    {member.projectName || "—"}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={member.status}
                      type="report"
                      size="sm"
                    />
                  </TableCell>

                  <TableCell>
                    <span className="font-medium text-[#171A18]">
                      {member.completedTasks}
                    </span>
                    <span className="text-[#9AA19C]">
                      {" "}
                      / {member.totalTasks}
                    </span>
                  </TableCell>

                  <TableCell>
                    {member.openBlockers > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        <AlertTriangle className="h-3 w-3" />
                        {member.openBlockers} open
                      </span>
                    ) : (
                      <span className="text-[#9AA19C]">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right font-medium text-[#171A18]">
                    {member.reportCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};