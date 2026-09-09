import { useEffect, useState } from "react";
import { Save, Send, Calendar, Briefcase, FileText } from "lucide-react";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type {
  WeeklyReport,
  ReportTask,
  Blocker,
  Achievement,
  TimeEntry,
  WeeklyReportRequest,
} from "../../types/report";
import { weeklyReportSchema } from "../../schemas/report.schema";
import { BlockerSection } from "@/components/reports/BlockerSection";
import { AchievementSection } from "@/components/reports/AchievementSection";
import { TimeEntrySection } from "@/components/reports/TimeEntrySection";
import { ReportTaskSection } from "@/components/reports/ReportTaskSection";
import { useProjectStore } from "@/store/projectStore";

interface ReportFormProps {
  initialReport?: Partial<WeeklyReport>;
  onSubmit: (
    report: WeeklyReportRequest,
    isSubmit: boolean
  ) => void | Promise<void>;
  isEdit?: boolean;
}

interface ReportFormErrors {
  projectId?: string;
  weekStartDate?: string;
  weekEndDate?: string;
  tasks?: string;
  blockers?: string;
  achievements?: string;
  timeEntries?: string;
  general?: string;
}

export function ReportForm({
  initialReport,
  onSubmit,
  isEdit = false,
}: ReportFormProps) {
  const {
    projects,
    fetchProjects,
    isLoading: projectsLoading,
  } = useProjectStore();

  const [projectId, setProjectId] = useState<number>(
    initialReport?.projectId || 0
  );
  const [weekStartDate, setWeekStartDate] = useState<string>(
    initialReport?.weekStartDate || ""
  );
  const [weekEndDate, setWeekEndDate] = useState<string>(
    initialReport?.weekEndDate || ""
  );
  const [nextWeekTasks, setNextWeekTasks] = useState<string>(
    initialReport?.nextWeekTasks || ""
  );
  const [notes, setNotes] = useState<string>(initialReport?.notes || "");
  const [tasks, setTasks] = useState<ReportTask[]>(initialReport?.tasks || []);
  const [blockers, setBlockers] = useState<Blocker[]>(
    initialReport?.blockers || []
  );
  const [achievements, setAchievements] = useState<Achievement[]>(
    initialReport?.achievements || []
  );
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(
    initialReport?.timeEntries || []
  );
  const [errors, setErrors] = useState<ReportFormErrors>({});

  useEffect(() => {
    fetchProjects().catch(() => {});
  }, [fetchProjects]);

  useEffect(() => {
    if (!projectId && projects.length > 0) {
      setProjectId(projects[0].id);
    }
  }, [projects, projectId]);

  useEffect(() => {
    if (!weekStartDate && !weekEndDate) {
      const today = new Date();
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      setWeekStartDate(monday.toISOString().split("T")[0]);
      setWeekEndDate(sunday.toISOString().split("T")[0]);
    }
  }, [weekStartDate, weekEndDate]);

  const handleAddTask = (newTask: ReportTask) => {
    setTasks((current) => [...current, newTask]);
    setErrors((current) => ({
      ...current,
      tasks: undefined,
      general: undefined,
    }));
  };

  const handleRemoveTask = (taskId: number) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const handleAddBlocker = (newBlocker: Blocker) => {
    setBlockers((current) => [...current, newBlocker]);
    setErrors((current) => ({
      ...current,
      blockers: undefined,
      general: undefined,
    }));
  };

  const handleRemoveBlocker = (blockerId: number) => {
    setBlockers((current) =>
      current.filter((blocker) => blocker.id !== blockerId)
    );
  };

  const handleToggleBlockerResolved = (blockerId: number) => {
    setBlockers((current) =>
      current.map((blocker) =>
        blocker.id === blockerId
          ? { ...blocker, resolved: !blocker.resolved }
          : blocker
      )
    );
  };

  const handleAddAchievement = (newAchievement: Achievement) => {
    setAchievements((current) => [...current, newAchievement]);
    setErrors((current) => ({
      ...current,
      achievements: undefined,
      general: undefined,
    }));
  };

  const handleRemoveAchievement = (achievementId: number) => {
    setAchievements((current) =>
      current.filter((achievement) => achievement.id !== achievementId)
    );
  };

  const handleAddTimeEntry = (newEntry: TimeEntry) => {
    setTimeEntries((current) => [...current, newEntry]);
    setErrors((current) => ({
      ...current,
      timeEntries: undefined,
      general: undefined,
    }));
  };

  const handleRemoveTimeEntry = (entryId: number) => {
    setTimeEntries((current) =>
      current.filter((entry) => entry.id !== entryId)
    );
  };

  const handleFormAction = async (isSubmit: boolean) => {
    const reportPayload: WeeklyReportRequest = {
      projectId,
      weekStartDate,
      weekEndDate,
      nextWeekTasks: nextWeekTasks.trim() || undefined,
      notes: notes.trim() || undefined,
      tasks: tasks.map((task) => ({
        taskName: task.taskName,
        priority: task.priority,
        plannedPercentage: Number(task.plannedPercentage),
        actualPercentage: Number(task.actualPercentage),
        status: task.status,
        plannedHours: task.plannedHours ?? undefined,
        actualHours: task.actualHours ?? undefined,
        deliverable: task.deliverable?.trim() || undefined,
      })),
      blockers: blockers.map((blocker) => ({
        description: blocker.description.trim(),
        keyIssue: blocker.keyIssue,
        resolved: blocker.resolved,
      })),
      achievements: achievements.map((achievement) => ({
        description: achievement.description.trim(),
        keyAchievement: achievement.keyAchievement,
      })),
      timeEntries: timeEntries.map((entry) => ({
        taskType: entry.taskType,
        hours: Number(entry.hours),
      })),
    };

    const result = weeklyReportSchema.safeParse(reportPayload);

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      setErrors({
        projectId: tree.properties?.projectId?.errors[0],
        weekStartDate: tree.properties?.weekStartDate?.errors[0],
        weekEndDate: tree.properties?.weekEndDate?.errors[0],
        tasks: tree.properties?.tasks?.errors[0],
        blockers: tree.properties?.blockers?.errors[0],
        achievements: tree.properties?.achievements?.errors[0],
        timeEntries: tree.properties?.timeEntries?.errors[0],
        general: tree.errors[0],
      });
      return;
    }

    setErrors({});
    await onSubmit(result.data, isSubmit);
  };

  return (
    <div className="space-y-6">
      {Object.values(errors).some(Boolean) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-red-300 bg-white text-red-700"
            >
              Validation Error
            </Badge>
            <span className="text-xs font-medium text-red-700">
              Please fix the highlighted fields before continuing.
            </span>
          </div>
          {errors.general && (
            <p className="mt-2 text-xs font-medium text-red-700">
              {errors.general}
            </p>
          )}
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-[#E5E7E5] bg-white p-6">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <Briefcase className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">
            1. Report Metadata
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <Label
              htmlFor="project"
              className="text-xs font-semibold text-[#171A18]"
            >
              Select Project *
            </Label>
            <Select
              value={projectId ? String(projectId) : ""}
              onValueChange={(value) => {
                setProjectId(Number(value));
                setErrors((current) => ({
                  ...current,
                  projectId: undefined,
                  general: undefined,
                }));
              }}
              disabled={projectsLoading || projects.length === 0}
            >
              <SelectTrigger
                id="project"
                className={`h-10 w-full rounded-lg bg-[#F7F8F7] text-xs font-semibold text-[#171A18] focus:border-[#171A18] focus:ring-0 ${
                  errors.projectId ? "border-red-400" : "border-[#E5E7E5]"
                }`}
              >
                <SelectValue
                  placeholder={
                    projectsLoading ? "Loading projects..." : "Select project"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {projects
                  .filter((project) => project.active)
                  .map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.projectId && (
              <p className="text-xs font-medium text-red-600">
                {errors.projectId}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="weekStartDate"
              className="text-xs font-semibold text-[#171A18]"
            >
              Week Start Date *
            </Label>
            <Input
              id="weekStartDate"
              type="date"
              value={weekStartDate}
              onChange={(e) => {
                setWeekStartDate(e.target.value);
                setErrors((current) => ({
                  ...current,
                  weekStartDate: undefined,
                  weekEndDate: undefined,
                  general: undefined,
                }));
              }}
              className={`h-10 rounded-lg bg-[#F7F8F7] text-xs font-semibold text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0 ${
                errors.weekStartDate ? "border-red-400" : "border-[#E5E7E5]"
              }`}
            />
            {errors.weekStartDate && (
              <p className="text-xs font-medium text-red-600">
                {errors.weekStartDate}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="weekEndDate"
              className="text-xs font-semibold text-[#171A18]"
            >
              Week End Date *
            </Label>
            <Input
              id="weekEndDate"
              type="date"
              value={weekEndDate}
              onChange={(e) => {
                setWeekEndDate(e.target.value);
                setErrors((current) => ({
                  ...current,
                  weekEndDate: undefined,
                  general: undefined,
                }));
              }}
              className={`h-10 rounded-lg bg-[#F7F8F7] text-xs font-semibold text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0 ${
                errors.weekEndDate ? "border-red-400" : "border-[#E5E7E5]"
              }`}
            />
            {errors.weekEndDate && (
              <p className="text-xs font-medium text-red-600">
                {errors.weekEndDate}
              </p>
            )}
          </div>
        </div>
      </div>

      <ReportTaskSection
        tasks={tasks}
        onAddTask={handleAddTask}
        onRemoveTask={handleRemoveTask}
        onUpdateTask={(updatedTask) =>
          setTasks((currentTasks) =>
            currentTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          )
        }
        isEditable={true}
      />
      {errors.tasks && (
        <p className="text-xs font-medium text-red-600">{errors.tasks}</p>
      )}

      <div className="space-y-3 rounded-xl border border-[#E5E7E5] bg-white p-6">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <Calendar className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">
            Planned Tasks for Next Week
          </h3>
        </div>
        <p className="text-xs text-[#6B726D]">
          List goals, objectives, and deliverables targeted for the upcoming
          sprint.
        </p>
        <Textarea
          rows={4}
          value={nextWeekTasks}
          onChange={(e) => setNextWeekTasks(e.target.value)}
          placeholder={
            "- Deliver high-fidelity modal mockups\n- Setup unit test coverage for report state\n- Deploy release candidate v2.1"
          }
          className="resize-none rounded-lg border-[#E5E7E5] bg-[#F7F8F7]/50 p-3 font-mono text-xs leading-relaxed text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
        />
      </div>

      <BlockerSection
        blockers={blockers}
        onAddBlocker={handleAddBlocker}
        onRemoveBlocker={handleRemoveBlocker}
        onToggleResolved={handleToggleBlockerResolved}
        isEditable={true}
      />
      {errors.blockers && (
        <p className="text-xs font-medium text-red-600">{errors.blockers}</p>
      )}

      <AchievementSection
        achievements={achievements}
        onAddAchievement={handleAddAchievement}
        onRemoveAchievement={handleRemoveAchievement}
        isEditable={true}
      />
      {errors.achievements && (
        <p className="text-xs font-medium text-red-600">
          {errors.achievements}
        </p>
      )}

      <TimeEntrySection
        timeEntries={timeEntries}
        onAddTimeEntry={handleAddTimeEntry}
        onRemoveTimeEntry={handleRemoveTimeEntry}
        isEditable={true}
      />
      {errors.timeEntries && (
        <p className="text-xs font-medium text-red-600">{errors.timeEntries}</p>
      )}

      <div className="space-y-3 rounded-xl border border-[#E5E7E5] bg-white p-6">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <FileText className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">
            Additional Notes & Feedback
          </h3>
        </div>
        <Textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any extra comments, context for manager review, or personal reflections..."
          className="resize-none rounded-lg border-[#E5E7E5] bg-[#F7F8F7]/50 p-3 text-xs leading-relaxed text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
        />
      </div>

      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-[#E5E7E5] bg-white p-4 shadow-lg backdrop-blur-md">
        <div className="text-xs text-[#6B726D]">
          <span className="font-semibold text-[#171A18]">
            {tasks.length} Tasks &bull; {blockers.length} Blockers &bull;{" "}
            {achievements.length} Highlights
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={!projectId || !weekStartDate || !weekEndDate}
            onClick={() => handleFormAction(false)}
            className="gap-1.5 rounded-lg border-[#E5E7E5] bg-white px-4 py-2 text-xs font-semibold text-[#171A18] transition-colors hover:bg-[#F7F8F7]"
          >
            <Save className="h-4 w-4 text-[#6B726D]" />
            {isEdit ? "Save Draft Changes" : "Save Draft"}
          </Button>

          <Button
            type="button"
            disabled={!projectId || !weekStartDate || !weekEndDate}
            onClick={() => handleFormAction(true)}
            className="gap-1.5 rounded-lg bg-[#8DF688] px-5 py-2 text-xs font-bold text-[#171A18] shadow-xs transition-colors hover:bg-[#7ae875]"
          >
            <Send className="h-4 w-4" />
            {initialReport?.status === "NEEDS_CORRECTION"
              ? "Resubmit Report"
              : "Submit Report"}
          </Button>
        </div>
      </div>
    </div>
  );
}
