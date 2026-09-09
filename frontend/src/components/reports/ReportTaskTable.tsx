import { ExternalLink, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ReportTask, Priority, TaskStatus } from "../../types/report";

interface ReportTaskTableProps {
  tasks: ReportTask[];
  isEditable?: boolean;
  onRemoveTask?: (id: number) => void;
  onEditTask?: (task: ReportTask) => void;
}

const priorityStyles: Record<Priority, string> = {
  LOW: "border-slate-200 bg-slate-50 text-slate-600",
  MEDIUM: "border-blue-200 bg-blue-50 text-blue-700",
  HIGH: "border-orange-200 bg-orange-50 text-orange-700",
  CRITICAL: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusStyles: Record<TaskStatus, string> = {
  NOT_STARTED: "border-slate-200 bg-slate-50 text-slate-600",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  BLOCKED: "border-rose-200 bg-rose-50 text-rose-700",
};

const priorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

const statusLabels: Record<TaskStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
};

export function ReportTaskTable({
  tasks,
  isEditable = false,
  onRemoveTask,
  onEditTask,
}: ReportTaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#E5E7E5] p-6 text-center text-xs text-[#6B726D]">
        No tasks added yet. Click "Add Task" to record your deliverables.
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto rounded-xl border border-[#E5E7E5] bg-white md:block">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E5E7E5] bg-[#F7F8F7] text-[#6B726D]">
              <th className="px-4 py-3 font-semibold">Task Name</th>
              <th className="px-3 py-3 font-semibold">Priority</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Planned %</th>
              <th className="px-3 py-3 font-semibold">Actual %</th>
              <th className="px-3 py-3 font-semibold">Hours (Plan / Act)</th>
              <th className="px-3 py-3 font-semibold">Deliverable</th>
              {isEditable && (
                <th className="px-3 py-3 text-right font-semibold">Action</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E5E7E5]">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="transition-colors hover:bg-[#F7F8F7]/40"
              >
                <td className="px-4 py-3 font-medium text-[#171A18]">
                  {task.taskName}
                </td>

                <td className="px-3 py-3">
                  <Badge
                    variant="outline"
                    className={priorityStyles[task.priority]}
                  >
                    {priorityLabels[task.priority]}
                  </Badge>
                </td>

                <td className="px-3 py-3">
                  <Badge
                    variant="outline"
                    className={statusStyles[task.status]}
                  >
                    {statusLabels[task.status]}
                  </Badge>
                </td>

                <td className="px-3 py-3 font-medium text-[#6B726D]">
                  {task.plannedPercentage}%
                </td>

                <td className="px-3 py-3 font-semibold text-[#171A18]">
                  {task.actualPercentage}%
                </td>

                <td className="px-3 py-3 text-[#6B726D]">
                  {task.plannedHours ?? 0}h /{" "}
                  <span className="font-semibold text-[#171A18]">
                    {task.actualHours ?? 0}h
                  </span>
                </td>

                <td className="px-3 py-3">
                  {task.deliverable ? (
                    task.deliverable.startsWith("http") ? (
                      <a
                        href={task.deliverable}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#171A18] hover:underline"
                      >
                        Link
                        <ExternalLink className="h-3 w-3 text-[#6B726D]" />
                      </a>
                    ) : (
                      <span
                        className="block max-w-[180px] truncate text-xs font-medium text-[#171A18]"
                        title={task.deliverable}
                      >
                        {task.deliverable}
                      </span>
                    )
                  ) : (
                    <span className="text-[#9AA19C]">&mdash;</span>
                  )}
                </td>

                {isEditable && (
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditTask?.(task)}
                        className="h-7 w-7 rounded text-[#6B726D] hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Edit ${task.taskName}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveTask(task.id)}
                        className="h-7 w-7 rounded text-[#6B726D] hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Delete ${task.taskName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="space-y-3 md:hidden">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="space-y-3 rounded-xl border border-[#E5E7E5] bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-[#171A18]">
                  {task.taskName}
                </h4>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={priorityStyles[task.priority]}
                  >
                    {priorityLabels[task.priority]}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={statusStyles[task.status]}
                  >
                    {statusLabels[task.status]}
                  </Badge>
                </div>
              </div>

              {isEditable && (
                <div className="ml-2 flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditTask?.(task)}
                    className="h-7 w-7 rounded text-[#6B726D] hover:bg-blue-50 hover:text-blue-600"
                    aria-label={`Edit ${task.taskName}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveTask(task.id)}
                    className="h-7 w-7 rounded text-[#6B726D] hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Delete ${task.taskName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] p-2.5 text-xs">
              <div>
                <span className="text-[#6B726D]">Progress: </span>
                <span className="font-bold text-[#171A18]">
                  {task.actualPercentage}%
                </span>{" "}
                <span className="text-[#6B726D]">
                  (Plan {task.plannedPercentage}%)
                </span>
              </div>

              <div>
                <span className="text-[#6B726D]">Hours: </span>
                <span className="font-bold text-[#171A18]">
                  {task.actualHours ?? 0}h
                </span>{" "}
                <span className="text-[#6B726D]">
                  (Plan {task.plannedHours ?? 0}h)
                </span>
              </div>
            </div>

            {task.deliverable && (
              <div className="text-xs text-[#6B726D]">
                <span>Deliverable: </span>

                {task.deliverable.startsWith("http") ? (
                  <a
                    href={task.deliverable}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-1 break-all font-medium text-[#171A18] hover:underline"
                  >
                    <span className="break-all">{task.deliverable}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 text-[#6B726D]" />
                  </a>
                ) : (
                  <span className="break-all font-medium text-[#171A18]">
                    {task.deliverable}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}