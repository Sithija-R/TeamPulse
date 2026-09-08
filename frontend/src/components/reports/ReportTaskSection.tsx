import { useState, type SubmitEvent } from "react";
import { CheckSquare, Pencil, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ReportTask, Priority, TaskStatus } from "../../types/report";
import { ReportTaskTable } from "./ReportTaskTable";

interface ReportTaskSectionProps {
  tasks: ReportTask[];
  onAddTask: (task: ReportTask) => void;
  onUpdateTask: (task: ReportTask) => void;
  onRemoveTask: (id: number) => void;
  isEditable?: boolean;
}

export function ReportTaskSection({
  tasks,
  onAddTask,
  onUpdateTask,
  onRemoveTask,
  isEditable = true,
}: ReportTaskSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [plannedPercentage, setPlannedPercentage] = useState(100);
  const [actualPercentage, setActualPercentage] = useState(100);
  const [status, setStatus] = useState<TaskStatus>("COMPLETED");
  const [plannedHours, setPlannedHours] = useState(8);
  const [actualHours, setActualHours] = useState(8);
  const [deliverable, setDeliverable] = useState("");

  const completedCount = tasks.filter((task) => task.status === "COMPLETED").length;
  const avgCompletion = tasks.length
    ? Math.round(tasks.reduce((acc, task) => acc + task.actualPercentage, 0) / tasks.length)
    : 0;

  const resetForm = () => {
    setTaskName("");
    setPriority("MEDIUM");
    setPlannedPercentage(100);
    setActualPercentage(100);
    setStatus("COMPLETED");
    setPlannedHours(8);
    setActualHours(8);
    setDeliverable("");
  };

  const handleSubmitNewTask = (e: SubmitEvent<HTMLFormElement>) => {
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
    resetForm();
    setShowAddForm(false);
  };

  const startEditing = (task: ReportTask) => {
    setEditingTaskId(task.id);
    setTaskName(task.taskName);
    setPriority(task.priority);
    setPlannedPercentage(task.plannedPercentage);
    setActualPercentage(task.actualPercentage);
    setStatus(task.status);
    setPlannedHours(task.plannedHours ?? 0);
    setActualHours(task.actualHours ?? 0);
    setDeliverable(task.deliverable ?? "");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    resetForm();
  };

  const handleUpdateTask = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTaskId || !taskName.trim()) return;

    const existingTask = tasks.find((task) => task.id === editingTaskId);
    if (!existingTask) return;

    onUpdateTask({
      ...existingTask,
      taskName: taskName.trim(),
      priority,
      plannedPercentage: Number(plannedPercentage),
      actualPercentage: Number(actualPercentage),
      status,
      plannedHours: Number(plannedHours),
      actualHours: Number(actualHours),
      deliverable: deliverable.trim() || null,
    });

    cancelEditing();
  };

  return (
    <div className="space-y-4 rounded-xl border border-[#E5E7E5] bg-white p-5">
      <div className="flex flex-col gap-2 border-b border-[#E5E7E5] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-[#171A18]" />
            <h3 className="text-base font-bold text-[#171A18]">Completed & Ongoing Tasks</h3>
          </div>
          <p className="mt-0.5 text-xs text-[#6B726D]">
            Log all key engineering or design tasks worked on this week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs">
            <span className="text-[#6B726D]">Tasks:</span>
            <span className="font-bold text-[#171A18]">
              {completedCount}/{tasks.length} Completed
            </span>
            <span className="text-[#9AA19C]">&bull;</span>
            <span className="text-[#6B726D]">Avg Progress:</span>
            <span className="font-bold text-[#171A18]">{avgCompletion}%</span>
          </div>

          {isEditable && (
            <Button
              type="button"
              onClick={() => {
                setShowAddForm((value) => !value);
                setEditingTaskId(null);
              }}
              className="h-auto gap-1.5 rounded-lg bg-[#8DF688] px-3 py-1.5 text-xs font-bold text-[#171A18] transition-colors hover:bg-[#7ae875]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Task
            </Button>
          )}
        </div>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmitNewTask}
          className="animate-in space-y-4 rounded-xl border border-[#8DF688] bg-[#8DF688]/10 p-4 fade-in duration-200"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#171A18]">Add New Task Entry</h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="task-name" className="text-xs font-semibold text-[#171A18]">Task Name *</Label>
              <Input
                id="task-name"
                type="text"
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Implement user authentication middleware"
                className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="priority" className="text-xs font-semibold text-[#171A18]">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="priority" className="h-9 w-full rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="status" className="text-xs font-semibold text-[#171A18]">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger id="status" className="h-9 w-full rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="planned-progress" className="text-xs font-semibold text-[#171A18]">Planned Progress (%)</Label>
              <Input id="planned-progress" type="number" min="0" max="100" value={plannedPercentage} onChange={(e) => setPlannedPercentage(Number(e.target.value))} className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="actual-progress" className="text-xs font-semibold text-[#171A18]">Actual Progress (%)</Label>
              <Input id="actual-progress" type="number" min="0" max="100" value={actualPercentage} onChange={(e) => setActualPercentage(Number(e.target.value))} className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="planned-hours" className="text-xs font-semibold text-[#171A18]">Planned Hours</Label>
              <Input id="planned-hours" type="number" min="0" step="0.5" value={plannedHours} onChange={(e) => setPlannedHours(Number(e.target.value))} className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="actual-hours" className="text-xs font-semibold text-[#171A18]">Actual Hours</Label>
              <Input id="actual-hours" type="number" min="0" step="0.5" value={actualHours} onChange={(e) => setActualHours(Number(e.target.value))} className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-4">
              <Label htmlFor="deliverable" className="text-xs font-semibold text-[#171A18]">Deliverable URL or Artifact (Optional)</Label>
              <Input
                id="deliverable"
                type="text"
                value={deliverable}
                onChange={(e) => setDeliverable(e.target.value)}
                placeholder="e.g. https://github.com/org/repo/pull/12"
                className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }} className="rounded-lg border-[#E5E7E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]">
              Cancel
            </Button>
            <Button type="submit" disabled={!taskName.trim()} className="rounded-lg bg-[#171A18] px-4 py-1.5 text-xs font-semibold text-white hover:bg-black">
              Save Task
            </Button>
          </div>
        </form>
      )}

      {editingTaskId !== null && (
        <form
          onSubmit={handleUpdateTask}
          className="animate-in space-y-4 rounded-xl border border-[#E5E7E5] bg-[#F7F8F7] p-4 fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171A18]">Edit Task</h4>
            <Button type="button" variant="ghost" size="icon" onClick={cancelEditing} className="h-7 w-7 text-[#6B726D] hover:bg-white hover:text-[#171A18]">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="edit-task-name" className="text-xs font-semibold text-[#171A18]">Task Name *</Label>
              <Input id="edit-task-name" required value={taskName} onChange={(e) => setTaskName(e.target.value)} className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-priority" className="text-xs font-semibold text-[#171A18]">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="edit-priority" className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-status" className="text-xs font-semibold text-[#171A18]">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger id="edit-status" className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-planned-progress" className="text-xs font-semibold text-[#171A18]">Planned Progress (%)</Label>
              <Input id="edit-planned-progress" type="number" min="0" max="100" value={plannedPercentage} onChange={(e) => setPlannedPercentage(Number(e.target.value))} className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-actual-progress" className="text-xs font-semibold text-[#171A18]">Actual Progress (%)</Label>
              <Input id="edit-actual-progress" type="number" min="0" max="100" value={actualPercentage} onChange={(e) => setActualPercentage(Number(e.target.value))} className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-planned-hours" className="text-xs font-semibold text-[#171A18]">Planned Hours</Label>
              <Input id="edit-planned-hours" type="number" min="0" step="0.5" value={plannedHours} onChange={(e) => setPlannedHours(Number(e.target.value))} className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-actual-hours" className="text-xs font-semibold text-[#171A18]">Actual Hours</Label>
              <Input id="edit-actual-hours" type="number" min="0" step="0.5" value={actualHours} onChange={(e) => setActualHours(Number(e.target.value))} className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-4">
              <Label htmlFor="edit-deliverable" className="text-xs font-semibold text-[#171A18]">Deliverable URL or Artifact (Optional)</Label>
              <Input id="edit-deliverable" value={deliverable} onChange={(e) => setDeliverable(e.target.value)} placeholder="e.g. https://github.com/org/repo/pull/12" className="h-9 rounded-lg border-[#E5E7E5] bg-white text-xs text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={cancelEditing} className="rounded-lg border-[#E5E7E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]">
              Cancel
            </Button>
            <Button type="submit" disabled={!taskName.trim()} className="gap-1.5 rounded-lg bg-[#171A18] px-4 py-1.5 text-xs font-semibold text-white hover:bg-black">
              <Save className="h-3.5 w-3.5" />
              Update Task
            </Button>
          </div>
        </form>
      )}

      <ReportTaskTable
        tasks={tasks}
        isEditable={isEditable}
        onRemoveTask={onRemoveTask}
        onEditTask={startEditing}
      />
    </div>
  );
}