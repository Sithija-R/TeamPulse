import React, { useState } from 'react';
import { TimeEntry, TaskType } from '../../types/report';
import { TASK_TYPES, TASK_TYPE_LABELS } from '../../lib/constants';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface TimeEntrySectionProps {
  timeEntries: TimeEntry[];
  onAddTimeEntry: (entry: TimeEntry) => void;
  onRemoveTimeEntry: (id: number) => void;
  isEditable?: boolean;
}

export const TimeEntrySection: React.FC<TimeEntrySectionProps> = ({
  timeEntries,
  onAddTimeEntry,
  onRemoveTimeEntry,
  isEditable = true,
}) => {
  const [taskType, setTaskType] = useState<TaskType>('DEVELOPMENT');
  const [hours, setHours] = useState<number>(4);
  const [showAdd, setShowAdd] = useState(false);

  const totalHours = timeEntries.reduce((acc, t) => acc + t.hours, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (hours <= 0) return;

    onAddTimeEntry({
      id: Date.now(),
      taskType,
      hours: Number(hours),
    });

    setHours(4);
    setShowAdd(false);
  };

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#171A18]" />
            <h3 className="text-base font-bold text-[#171A18]">Time Distribution by Task Type</h3>
          </div>
          <p className="text-xs text-[#6B726D] mt-0.5">
            Record total hours allocated across engineering activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#F7F8F7] px-3 py-1.5 rounded-lg border border-[#E5E7E5] text-xs">
            <span className="text-[#6B726D]">Total Logged:</span>
            <span className="font-bold text-sm text-[#171A18]">{totalHours} hrs</span>
          </div>

          {isEditable && (
            <button
              type="button"
              onClick={() => setShowAdd(!showAdd)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs font-bold text-[#171A18] hover:bg-[#8DF688]/30 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Hours
            </button>
          )}
        </div>
      </div>

      {/* Visual Hours Distribution Bar */}
      {totalHours > 0 && (
        <div className="space-y-1.5">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#F7F8F7] border border-[#E5E7E5]">
            {timeEntries.map((t) => (
              <div
                key={t.id}
                style={{ width: `${(t.hours / totalHours) * 100}%` }}
                className="h-full bg-[#8DF688] border-r border-white/50 first:rounded-l-full last:rounded-r-full"
                title={`${TASK_TYPE_LABELS[t.taskType]}: ${t.hours} hrs`}
              />
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleAdd} className="rounded-xl border border-[#E5E7E5] bg-[#F7F8F7] p-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Category Task Type
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as TaskType)}
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] outline-none"
              >
                {TASK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {TASK_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Hours Spent
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs text-[#171A18] outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#171A18] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black cursor-pointer"
            >
              Save Time Entry
            </button>
          </div>
        </form>
      )}

      {/* Entry Cards/Grid */}
      {timeEntries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#E5E7E5] p-4 text-center text-xs text-[#6B726D]">
          No time entries added.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {timeEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-[#E5E7E5] bg-[#F7F8F7]/50 p-3"
            >
              <div>
                <span className="block text-[11px] font-semibold text-[#6B726D]">
                  {TASK_TYPE_LABELS[entry.taskType]}
                </span>
                <span className="text-sm font-bold text-[#171A18]">{entry.hours} hrs</span>
              </div>
              {isEditable && (
                <button
                  type="button"
                  onClick={() => onRemoveTimeEntry(entry.id)}
                  className="text-[#6B726D] hover:text-rose-600 cursor-pointer ml-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
