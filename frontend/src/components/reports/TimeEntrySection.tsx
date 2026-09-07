import { useState, type SubmitEvent } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TimeEntry, TaskType } from "../../types/report";
import { TASK_TYPES, TASK_TYPE_LABELS } from "../../lib/constants";

interface TimeEntrySectionProps {
  timeEntries: TimeEntry[];
  onAddTimeEntry: (entry: TimeEntry) => void;
  onRemoveTimeEntry: (id: number) => void;
  isEditable?: boolean;
}

const TASK_TYPE_COLORS: Record<TaskType, string> = {
  DEVELOPMENT: "#8DF688",
  TESTING: "#60A5FA",
  MEETINGS: "#FBBF24",
  DOCUMENTATION: "#A78BFA",
  RESEARCH: "#F472B6",
  OTHER: "#94A3B8",
};

export function TimeEntrySection({
  timeEntries,
  onAddTimeEntry,
  onRemoveTimeEntry,
  isEditable = true,
}: TimeEntrySectionProps) {
  const [taskType, setTaskType] = useState<TaskType | "">("");
  const [hours, setHours] = useState<number>(4);
  const [showAdd, setShowAdd] = useState(false);

  const totalHours = timeEntries.reduce((acc, entry) => acc + entry.hours, 0);

  const availableTaskTypes = TASK_TYPES.filter(
    (type) => !timeEntries.some((entry) => entry.taskType === type)
  );

  const handleAdd = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!taskType || hours <= 0) return;

    onAddTimeEntry({
      id: Date.now(),
      taskType,
      hours: Number(hours),
    });

    setTaskType("");
    setHours(4);
    setShowAdd(false);
  };

  return (
    <div className="space-y-4 rounded-xl border border-[#E5E7E5] bg-white p-5">
      <div className="flex flex-col gap-2 border-b border-[#E5E7E5] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#171A18]" />
            <h3 className="text-base font-bold text-[#171A18]">
              Time Distribution by Task Type
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#6B726D]">
            Record total hours allocated across engineering activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs">
            <span className="text-[#6B726D]">Total Logged:</span>
            <span className="text-sm font-bold text-[#171A18]">
              {totalHours} hrs
            </span>
          </div>

          {isEditable && availableTaskTypes.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdd((value) => !value)}
              className="h-auto gap-1.5 rounded-lg border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs font-bold text-[#171A18] transition-colors hover:bg-[#8DF688]/30"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Hours
            </Button>
          )}
        </div>
      </div>

      {totalHours > 0 && (
        <div className="space-y-2">
          <div className="flex h-3 w-full overflow-hidden rounded-full border border-[#E5E7E5] bg-[#F7F8F7]">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  width: `${(entry.hours / totalHours) * 100}%`,
                  backgroundColor: TASK_TYPE_COLORS[entry.taskType],
                }}
                className="h-full min-w-0 border-r border-white/70 transition-all last:border-r-0"
                title={`${TASK_TYPE_LABELS[entry.taskType]}: ${entry.hours} hrs`}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-1.5 text-[10px] text-[#6B726D]"
              >
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{
                    backgroundColor: TASK_TYPE_COLORS[entry.taskType],
                  }}
                />
                <span>{TASK_TYPE_LABELS[entry.taskType]}</span>
                <span className="font-bold text-[#171A18]">
                  {entry.hours}h
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && availableTaskTypes.length > 0 && (
        <form
          onSubmit={handleAdd}
          className="space-y-3 rounded-xl border border-[#E5E7E5] bg-[#F7F8F7] p-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label
                htmlFor="task-type"
                className="text-xs font-semibold text-[#171A18]"
              >
                Category Task Type
              </Label>

              <Select
                value={taskType}
                onValueChange={(value) => setTaskType(value as TaskType)}
              >
                <SelectTrigger
                  id="task-type"
                  className="h-9 w-full rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18]"
                >
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>

                <SelectContent>
                  {availableTaskTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {TASK_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="hours"
                className="text-xs font-semibold text-[#171A18]"
              >
                Hours Spent
              </Label>

              <Input
                id="hours"
                type="number"
                min="0.5"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAdd(false);
                setTaskType("");
                setHours(4);
              }}
              className="h-auto rounded-lg border-[#E5E7E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!taskType || hours <= 0}
              className="h-auto rounded-lg bg-[#171A18] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black"
            >
              Save Time Entry
            </Button>
          </div>
        </form>
      )}

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
                <span className="text-sm font-bold text-[#171A18]">
                  {entry.hours} hrs
                </span>
              </div>

              {isEditable && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveTimeEntry(entry.id)}
                  className="ml-1 h-7 w-7 text-[#6B726D] hover:bg-transparent hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {timeEntries.length > 0 && availableTaskTypes.length === 0 && (
        <p className="text-center text-[11px] text-[#6B726D]">
          All task types have been added.
        </p>
      )}
    </div>
  );
}