import { useState } from "react";
import { ArrowRight, CheckCircle2, Eye, History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { formatDateTime } from "../../lib/utils";
import { ReportSummary } from "./ReportSummary";
import type { ReportVersion } from "../../types/review";
import type { WeeklyReport } from "../../types/report";

interface VersionHistoryProps {
  versions: ReportVersion[];
}

type SnapshotReport = Omit<WeeklyReport, "status">;

function normalizeDateTime(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (!Array.isArray(value) || value.length < 6) {
    return "";
  }

  const [
    year,
    month,
    day,
    hour,
    minute,
    second,
    nanoseconds = 0,
  ] = value.map(Number);

  const fraction = Math.round(nanoseconds / 1000)
    .toString()
    .padStart(6, "0");

  return `${String(year).padStart(4, "0")}-${String(month).padStart(
    2,
    "0",
  )}-${String(day).padStart(2, "0")}T${String(hour).padStart(
    2,
    "0",
  )}:${String(minute).padStart(2, "0")}:${String(second).padStart(
    2,
    "0",
  )}.${fraction}`;
}

function normalizeSnapshotDates(report: SnapshotReport): SnapshotReport {
  return {
    ...report,
    weekStartDate:
      normalizeDateTime(report.weekStartDate) || report.weekStartDate,
    weekEndDate:
      normalizeDateTime(report.weekEndDate) || report.weekEndDate,
    submittedAt: report.submittedAt
      ? normalizeDateTime(report.submittedAt)
      : null,
    approvedAt: report.approvedAt
      ? normalizeDateTime(report.approvedAt)
      : null,
  };
}

export function VersionHistory({ versions }: VersionHistoryProps) {
  const [selectedSnapshot, setSelectedSnapshot] = useState<{
    versionNumber: number;
    report: SnapshotReport;
  } | null>(null);

  if (!versions || versions.length === 0) {
    return (
      <Card className="border-dashed border-[#E5E7E5] bg-white shadow-sm">
        <CardContent className="p-6 text-center text-xs text-[#6B726D]">
          No version history available.
        </CardContent>
      </Card>
    );
  }

  const sortedVersions = [...versions].sort(
    (a, b) => b.versionNumber - a.versionNumber,
  );

  const latestVersionNumber = Math.max(
    ...versions.map((version) => version.versionNumber),
  );

  return (
    <>
      <Card className="border-[#E5E7E5] bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#171A18]">
              <History className="h-4 w-4" />
              Report Version History
            </CardTitle>

            <Badge
              variant="outline"
              className="border-[#E5E7E5] bg-[#F7F8F7] text-xs font-medium text-[#6B726D]"
            >
              {versions.length}{" "}
              {versions.length === 1 ? "Version" : "Versions"} Tracked
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-5">
          <div className="relative space-y-6 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-[#E5E7E5]">
            {sortedVersions.map((ver) => {
              let parsedReport: SnapshotReport | null = null;

              try {
                const snapshot = JSON.parse(ver.contentSnapshot) as WeeklyReport & {
                  status?: unknown;
                  submittedAt?: unknown;
                  approvedAt?: unknown;
                };

                const { status: _status, ...reportWithoutStatus } = snapshot;

                parsedReport = normalizeSnapshotDates({
                  ...reportWithoutStatus,
                  submittedAt: normalizeDateTime(snapshot.submittedAt),
                  approvedAt: normalizeDateTime(snapshot.approvedAt),
                } as SnapshotReport);
              } catch {
                parsedReport = null;
              }

              const isLatest =
                ver.versionNumber === latestVersionNumber;

              return (
                <div key={ver.id} className="group relative">
                  <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#171A18] bg-white">
                    {isLatest ? (
                      <CheckCircle2 className="h-3 w-3 text-[#8DF688]" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8DF688]" />
                    )}
                  </div>

                  <Card className="border-[#E5E7E5] bg-[#F7F8F7]/50 shadow-none transition-colors hover:border-[#171A18]">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#171A18]">
                            Version {ver.versionNumber}
                          </span>

                          {isLatest && (
                            <Badge
                              variant="outline"
                              className="border-[#8DF688] bg-[#8DF688] px-2 py-0.5 text-[10px] font-bold text-[#171A18]"
                            >
                              LATEST
                            </Badge>
                          )}
                        </div>

                        <span className="text-xs text-[#6B726D]">
                          Submitted{" "}
                          {formatDateTime(
                            normalizeDateTime(ver.createdAt),
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        {parsedReport && (
                          <div className="flex flex-wrap items-center gap-2">
                            {parsedReport.tasks?.length > 0 && (
                              <Badge
                                variant="outline"
                                className="border-blue-200 bg-blue-50 text-[10px] font-semibold text-blue-700"
                              >
                                {parsedReport.tasks.length} Tasks
                              </Badge>
                            )}

                            {parsedReport.blockers?.length > 0 && (
                              <Badge
                                variant="outline"
                                className="border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-700"
                              >
                                {parsedReport.blockers.length} Blockers
                              </Badge>
                            )}

                            {parsedReport.achievements?.length > 0 && (
                              <Badge
                                variant="outline"
                                className="border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-700"
                              >
                                {parsedReport.achievements.length} Achievements
                              </Badge>
                            )}
                          </div>
                        )}

                        {parsedReport && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedSnapshot({
                                versionNumber: ver.versionNumber,
                                report: parsedReport,
                              })
                            }
                            className="h-8 gap-1 px-2 text-xs font-semibold text-[#171A18] hover:bg-[#E8FCE8] hover:text-[#171A18]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Inspect Version Snapshot
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={selectedSnapshot !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSnapshot(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] min-w-[80vw] overflow-hidden border-[#E5E7E5] bg-white p-3">
          <div className="flex max-h-[calc(90vh-1.5rem)] flex-col">
            <div className="shrink-0 pt-6">
              <DialogHeader className="border-b border-[#E5E7E5] px-6 py-5">
                <DialogTitle className="text-lg font-bold text-[#171A18]">
                  Version {selectedSnapshot?.versionNumber} Snapshot
                </DialogTitle>

                <DialogDescription className="mt-1 text-xs text-[#6B726D]">
                  Read-only view of historical report data
                </DialogDescription>
              </DialogHeader>
            </div>

            {selectedSnapshot && (
              <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <ReportSummary
                  report={selectedSnapshot.report as WeeklyReport}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}