import React, { useState } from 'react';
import { ReportTask, Priority, TaskStatus } from '../../types/report';
import { ReportTaskTable } from './ReportTaskTable';
import { Plus, CheckSquare } from 'lucide-react';

interface ReportTaskSectionProps {
  tasks: ReportTask[];
  onAddTask: (task: ReportTask) => void;
  onRemoveTask: (id: number) => void;
  isEditable?: boolean;
}

export const ReportTaskSection: React.FC<ReportTaskSectionProps> = ({
  tasks,
  onAddTask,
  onRemoveTask,
  isEditable = true,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [plannedPercentage, setPlannedPercentage] = useState(100);
  const [actualPercentage, setActualPercentage] = useState(100);
  const [status, setStatus] = useState<TaskStatus>('COMPLETED');
  const [plannedHours, setPlannedHours] = useState<number>(8);
  const [actualHours, setActualHours] = useState<number>(8);
  const [deliverable, setDeliverable] = useState('');

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const avgCompletion = tasks.length
    ? Math.round(tasks.reduce((acc, t) => acc + t.actualPercentage, 0) / tasks.length)
    : 0;

  const handleSubmitNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask: ReportTask = {
      id: Date.now(),
      taskName: taskName.trim(),
      priority,
      plannedPercentage: Number(plannedPercentage),
      actualPercentage: Number(actualPercentage),
      status,
      plannedHours: Number(plannedHours),
      actualHours: Number(actualHours),
      deliverable: deliverable.trim() || null,
    };

    onAddTask(newTask);
    setTaskName('');
    setDeliverable('');
    setShowAddForm(false);
  };

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-[#171A18]" />
            <h3 className="text-base font-bold text-[#171A18]">Completed & Ongoing Tasks</h3>
          </div>
          <p className="text-xs text-[#6B726D] mt-0.5">
            Log all key engineering or design tasks worked on this week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F7F8F7] px-3 py-1.5 rounded-lg border border-[#E5E7E5] text-xs">
            <span className="text-[#6B726D]">Tasks:</span>
            <span className="font-bold text-[#171A18]">
              {completedCount}/{tasks.length} Completed
            </span>
            <span className="text-[#9AA19C]">&bull;</span>
            <span className="text-[#6B726D]">Avg Progress:</span>
            <span className="font-bold text-[#171A18]">{avgCompletion}%</span>
          </div>

          {isEditable && (
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#8DF688] px-3 py-1.5 text-xs font-bold text-[#171A18] hover:bg-[#7ae875] transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Add Task Modal / Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmitNewTask}
          className="rounded-xl border border-[#8DF688] bg-[#8DF688]/10 p-4 space-y-4 animate-in fade-in duration-200"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#171A18]">
            Add New Task Entry
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Task Name *
              </label>
              <input
                type="text"
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Implement user authentication middleware"
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] focus:border-[#171A18] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] focus:border-[#171A18] outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] focus:border-[#171A18] outline-none"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Planned Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={plannedPercentage}
                onChange={(e) => setPlannedPercentage(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] focus:border-[#171A18] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Actual Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={actualPercentage}
                onChange={(e) => setActualPercentage(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] focus:border-[#171A18] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Planned Hours
              </label>
              <input
                type="number"
                min="0"
                value={plannedHours}
                onChange={(e) => setPlannedHours(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] focus:border-[#171A18] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Actual Hours
              </label>
              <input
                type="number"
                min="0"
                value={actualHours}
                onChange={(e) => setActualHours(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] focus:border-[#171A18] outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Deliverable URL or Artifact (Optional)
              </label>
              <input
                type="text"
                value={deliverable}
                onChange={(e) => setDeliverable(e.target.value)}
                placeholder="e.g. https://github.com/org/repo/pull/12"
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] focus:border-[#171A18] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#171A18] px-4 py-1.5 text-xs font-semibold text-white hover:bg-black cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task Table */}
      <ReportTaskTable tasks={tasks} isEditable={isEditable} onRemoveTask={onRemoveTask} />
    </div>
  );
};
