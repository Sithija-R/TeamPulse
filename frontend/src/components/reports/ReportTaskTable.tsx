import React from 'react';
import { ReportTask } from '../../types/report';
import { StatusBadge } from '../common/StatusBadge';
import { Trash2, ExternalLink } from 'lucide-react';

interface ReportTaskTableProps {
  tasks: ReportTask[];
  isEditable?: boolean;
  onRemoveTask?: (id: number) => void;
}

export const ReportTaskTable: React.FC<ReportTaskTableProps> = ({
  tasks,
  isEditable = false,
  onRemoveTask,
}) => {
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
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E5E7E5] bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E5E7E5] bg-[#F7F8F7] text-[#6B726D]">
              <th className="py-3 px-4 font-semibold">Task Name</th>
              <th className="py-3 px-3 font-semibold">Priority</th>
              <th className="py-3 px-3 font-semibold">Status</th>
              <th className="py-3 px-3 font-semibold">Planned %</th>
              <th className="py-3 px-3 font-semibold">Actual %</th>
              <th className="py-3 px-3 font-semibold">Hours (Plan / Act)</th>
              <th className="py-3 px-3 font-semibold">Deliverable</th>
              {isEditable && <th className="py-3 px-3 text-right font-semibold">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7E5]">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#F7F8F7]/40 transition-colors">
                <td className="py-3 px-4 font-medium text-[#171A18]">
                  {task.taskName}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={task.priority} type="priority" size="sm" />
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={task.status} type="task" size="sm" />
                </td>
                <td className="py-3 px-3 text-[#6B726D] font-medium">
                  {task.plannedPercentage}%
                </td>
                <td className="py-3 px-3 font-semibold text-[#171A18]">
                  {task.actualPercentage}%
                </td>
                <td className="py-3 px-3 text-[#6B726D]">
                  {task.plannedHours ?? 0}h / <span className="font-semibold text-[#171A18]">{task.actualHours ?? 0}h</span>
                </td>
                <td className="py-3 px-3">
                  {task.deliverable ? (
                    <a
                      href={task.deliverable.startsWith('http') ? task.deliverable : `#`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#171A18] hover:underline"
                    >
                      Link <ExternalLink className="h-3 w-3 text-[#6B726D]" />
                    </a>
                  ) : (
                    <span className="text-[#9AA19C]">&mdash;</span>
                  )}
                </td>
                {isEditable && (
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onRemoveTask && onRemoveTask(task.id)}
                      className="rounded p-1 text-[#6B726D] hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-[#E5E7E5] bg-white p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#171A18]">{task.taskName}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={task.priority} type="priority" size="sm" />
                  <StatusBadge status={task.status} type="task" size="sm" />
                </div>
              </div>
              {isEditable && (
                <button
                  type="button"
                  onClick={() => onRemoveTask && onRemoveTask(task.id)}
                  className="p-1 text-[#6B726D] hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#F7F8F7] p-2.5 rounded-lg border border-[#E5E7E5]">
              <div>
                <span className="text-[#6B726D]">Progress: </span>
                <span className="font-bold text-[#171A18]">{task.actualPercentage}%</span> (Plan {task.plannedPercentage}%)
              </div>
              <div>
                <span className="text-[#6B726D]">Hours: </span>
                <span className="font-bold text-[#171A18]">{task.actualHours || 0}h</span> (Plan {task.plannedHours || 0}h)
              </div>
            </div>

            {task.deliverable && (
              <div className="text-xs text-[#6B726D]">
                <span>Deliverable: </span>
                <span className="font-medium text-[#171A18] break-all">{task.deliverable}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
