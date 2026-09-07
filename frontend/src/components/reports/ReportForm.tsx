import { useEffect, useState } from "react";
import { Save, Send, Calendar, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WeeklyReport, ReportTask, Blocker, Achievement, TimeEntry, WeeklyReportRequest } from "../../types/report";

import { BlockerSection } from "@/components/reports/BlockerSection";
import { AchievementSection } from "@/components/reports/AchievementSection";
import { TimeEntrySection } from "@/components/reports/TimeEntrySection";

import { ReportTaskSection } from "@/components/reports/ReportTaskSection";
import { useProjectStore } from "@/store/projectStore";

interface ReportFormProps {
  initialReport?: Partial<WeeklyReport>;
  onSubmit: (report: WeeklyReportRequest, isSubmit: boolean) => void | Promise<void>;
  isEdit?: boolean;
}

export const ReportForm = ({ initialReport, onSubmit, isEdit = false }: ReportFormProps) => {

  const { projects, fetchProjects, isLoading: projectsLoading } = useProjectStore();
  
  const [projectId, setProjectId] = useState<number>(initialReport?.projectId || 0);
  const [weekStartDate, setWeekStartDate] = useState<string>(initialReport?.weekStartDate || "");
  const [weekEndDate, setWeekEndDate] = useState<string>(initialReport?.weekEndDate || "");
  const [nextWeekTasks, setNextWeekTasks] = useState<string>(initialReport?.nextWeekTasks || "");
  const [notes, setNotes] = useState<string>(initialReport?.notes || "");
  const [tasks, setTasks] = useState<ReportTask[]>(initialReport?.tasks || []);
  const [blockers, setBlockers] = useState<Blocker[]>(initialReport?.blockers || []);
  const [achievements, setAchievements] = useState<Achievement[]>(initialReport?.achievements || []);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialReport?.timeEntries || []);

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
  };

  const handleRemoveTask = (taskId: number) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const handleAddBlocker = (newBlocker: Blocker) => {
    setBlockers((current) => [...current, newBlocker]);
  };

  const handleRemoveBlocker = (blockerId: number) => {
    setBlockers((current) => current.filter((blocker) => blocker.id !== blockerId));
  };

  const handleToggleBlockerResolved = (blockerId: number) => {
    setBlockers((current) =>
      current.map((blocker) =>
        blocker.id === blockerId ? { ...blocker, resolved: !blocker.resolved } : blocker
      )
    );
  };

  const handleAddAchievement = (newAchievement: Achievement) => {
    setAchievements((current) => [...current, newAchievement]);
  };

  const handleRemoveAchievement = (achievementId: number) => {
    setAchievements((current) =>
      current.filter((achievement) => achievement.id !== achievementId)
    );
  };

  const handleAddTimeEntry = (newEntry: TimeEntry) => {
    setTimeEntries((current) => [...current, newEntry]);
  };

  const handleRemoveTimeEntry = (entryId: number) => {
    setTimeEntries((current) => current.filter((entry) => entry.id !== entryId));
  };

  const handleFormAction = async (isSubmit: boolean) => {
    if (!projectId || !weekStartDate || !weekEndDate) return;

    const reportPayload: WeeklyReportRequest = {
      projectId,
      weekStartDate,
      weekEndDate,
      nextWeekTasks: nextWeekTasks.trim() || undefined,
      notes: notes.trim() || undefined,
      tasks: tasks.map((task) => ({
        taskName: task.taskName,
        priority: task.priority,
        plannedPercentage: task.plannedPercentage,
        actualPercentage: task.actualPercentage,
        status: task.status,
        plannedHours: task.plannedHours ?? undefined,
        actualHours: task.actualHours ?? undefined,
        deliverable: task.deliverable ?? undefined,
      })),
      blockers: blockers.map((blocker) => ({
        description: blocker.description,
        keyIssue: blocker.keyIssue,
        resolved: blocker.resolved,
      })),
      achievements: achievements.map((achievement) => ({
        description: achievement.description,
        keyAchievement: achievement.keyAchievement,
      })),
      timeEntries: timeEntries.map((entry) => ({
        taskType: entry.taskType,
        hours: entry.hours,
      })),
    };

    await onSubmit(reportPayload, isSubmit);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-xl border border-[#E5E7E5] bg-white p-6">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <Briefcase className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">1. Report Metadata</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="project" className="text-xs font-semibold text-[#171A18]">
              Select Project *
            </Label>
            <Select
              value={projectId ? String(projectId) : ""}
              onValueChange={(value) => setProjectId(Number(value))}
              disabled={projectsLoading || projects.length === 0}
            >
              <SelectTrigger
                id="project"
                className="h-10 w-full rounded-lg border-[#E5E7E5] bg-[#F7F8F7] text-xs font-semibold text-[#171A18] focus:border-[#171A18] focus:ring-0"
              >
                <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select project"} />
              </SelectTrigger>
              <SelectContent>
                {projects.filter((project) => project.active).map((project) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="weekStartDate" className="text-xs font-semibold text-[#171A18]">
              Week Start Date *
            </Label>
            <Input
              id="weekStartDate"
              type="date"
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
              className="h-10 rounded-lg border-[#E5E7E5] bg-[#F7F8F7] text-xs font-semibold text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="weekEndDate" className="text-xs font-semibold text-[#171A18]">
              Week End Date *
            </Label>
            <Input
              id="weekEndDate"
              type="date"
              value={weekEndDate}
              onChange={(e) => setWeekEndDate(e.target.value)}
              className="h-10 rounded-lg border-[#E5E7E5] bg-[#F7F8F7] text-xs font-semibold text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      <ReportTaskSection
        tasks={tasks}
        onAddTask={handleAddTask}
        onRemoveTask={handleRemoveTask}
        isEditable={true}
      />

      <div className="space-y-3 rounded-xl border border-[#E5E7E5] bg-white p-6">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <Calendar className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">Planned Tasks for Next Week</h3>
        </div>
        <p className="text-xs text-[#6B726D]">
          List goals, objectives, and deliverables targeted for the upcoming sprint.
        </p>
        <Textarea
          rows={4}
          value={nextWeekTasks}
          onChange={(e) => setNextWeekTasks(e.target.value)}
          placeholder={"- Deliver high-fidelity modal mockups\n- Setup unit test coverage for report state\n- Deploy release candidate v2.1"}
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

      <AchievementSection
        achievements={achievements}
        onAddAchievement={handleAddAchievement}
        onRemoveAchievement={handleRemoveAchievement}
        isEditable={true}
      />

      <TimeEntrySection
        timeEntries={timeEntries}
        onAddTimeEntry={handleAddTimeEntry}
        onRemoveTimeEntry={handleRemoveTimeEntry}
        isEditable={true}
      />

      <div className="space-y-3 rounded-xl border border-[#E5E7E5] bg-white p-6">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <FileText className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">Additional Notes & Feedback</h3>
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
            {tasks.length} Tasks &bull; {blockers.length} Blockers &bull; {achievements.length} Highlights
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
};