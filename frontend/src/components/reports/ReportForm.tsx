import React, { useState } from 'react';
import { WeeklyReport, ReportTask, Blocker, Achievement, TimeEntry } from '../../types/report';
import { ReportTaskSection } from './ReportTaskSection';
import { BlockerSection } from './BlockerSection';
import { AchievementSection } from './AchievementSection';
import { TimeEntrySection } from './TimeEntrySection';
import { DUMMY_PROJECTS } from '../../lib/dummyData';
import { Save, Send, Calendar, Briefcase, FileText } from 'lucide-react';
import { CURRENT_WEEK } from '../../lib/constants';

interface ReportFormProps {
  initialReport?: Partial<WeeklyReport>;
  onSubmit: (report: Omit<WeeklyReport, 'id'>, isSubmit: boolean) => void;
  isEdit?: boolean;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  initialReport,
  onSubmit,
  isEdit = false,
}) => {
  const [projectId, setProjectId] = useState<number>(initialReport?.projectId || DUMMY_PROJECTS[0].id);
  const [weekStartDate, setWeekStartDate] = useState<string>(initialReport?.weekStartDate || CURRENT_WEEK.startDate);
  const [weekEndDate, setWeekEndDate] = useState<string>(initialReport?.weekEndDate || CURRENT_WEEK.endDate);
  const [nextWeekTasks, setNextWeekTasks] = useState<string>(initialReport?.nextWeekTasks || '');
  const [notes, setNotes] = useState<string>(initialReport?.notes || '');

  const [tasks, setTasks] = useState<ReportTask[]>(initialReport?.tasks || []);
  const [blockers, setBlockers] = useState<Blocker[]>(initialReport?.blockers || []);
  const [achievements, setAchievements] = useState<Achievement[]>(initialReport?.achievements || []);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(
    initialReport?.timeEntries || [
      { id: 1, taskType: 'DEVELOPMENT', hours: 20 },
      { id: 2, taskType: 'MEETINGS', hours: 5 },
    ]
  );

  const selectedProject = DUMMY_PROJECTS.find((p) => p.id === Number(projectId)) || DUMMY_PROJECTS[0];

  // Task Operations
  const handleAddTask = (newTask: ReportTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (taskId: number) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  // Blocker Operations
  const handleAddBlocker = (newBlocker: Blocker) => {
    setBlockers([...blockers, newBlocker]);
  };

  const handleRemoveBlocker = (blockerId: number) => {
    setBlockers(blockers.filter((b) => b.id !== blockerId));
  };

  const handleToggleBlockerResolved = (blockerId: number) => {
    setBlockers(
      blockers.map((b) => (b.id === blockerId ? { ...b, resolved: !b.resolved } : b))
    );
  };

  // Achievement Operations
  const handleAddAchievement = (newAchievement: Achievement) => {
    setAchievements([...achievements, newAchievement]);
  };

  const handleRemoveAchievement = (achievementId: number) => {
    setAchievements(achievements.filter((a) => a.id !== achievementId));
  };

  // Time Entry Operations
  const handleAddTimeEntry = (newEntry: TimeEntry) => {
    setTimeEntries([...timeEntries, newEntry]);
  };

  const handleRemoveTimeEntry = (entryId: number) => {
    setTimeEntries(timeEntries.filter((t) => t.id !== entryId));
  };

  const handleFormAction = (isSubmit: boolean) => {
    const reportPayload: Omit<WeeklyReport, 'id'> = {
      userId: initialReport?.userId || 1,
      userName: initialReport?.userName || 'Alex Morgan',
      projectId: Number(projectId),
      projectName: selectedProject.name,
      weekStartDate,
      weekEndDate,
      status: isSubmit ? 'SUBMITTED' : 'DRAFT',
      nextWeekTasks: nextWeekTasks.trim() || null,
      notes: notes.trim() || null,
      submittedAt: isSubmit ? new Date().toISOString() : initialReport?.submittedAt || null,
      approvedAt: initialReport?.approvedAt || null,
      tasks,
      blockers,
      achievements,
      timeEntries,
    };

    onSubmit(reportPayload, isSubmit);
  };

  return (
    <div className="space-y-6">
      {/* Report Information Card */}
      <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <Briefcase className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">1. Report Metadata</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-[#171A18] mb-1">
              Select Project *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              className="w-full rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-2 text-xs font-semibold text-[#171A18] outline-none focus:border-[#171A18]"
            >
              {DUMMY_PROJECTS.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171A18] mb-1">
              Week Start Date *
            </label>
            <input
              type="date"
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-2 text-xs font-semibold text-[#171A18] outline-none focus:border-[#171A18]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171A18] mb-1">
              Week End Date *
            </label>
            <input
              type="date"
              value={weekEndDate}
              onChange={(e) => setWeekEndDate(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-2 text-xs font-semibold text-[#171A18] outline-none focus:border-[#171A18]"
            />
          </div>
        </div>
      </div>

      {/* Completed Tasks Section */}
      <ReportTaskSection
        tasks={tasks}
        onAddTask={handleAddTask}
        onRemoveTask={handleRemoveTask}
        isEditable={true}
      />

      {/* Next Week Tasks Section */}
      <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <Calendar className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">Planned Tasks for Next Week</h3>
        </div>
        <p className="text-xs text-[#6B726D]">
          List goals, objectives, and deliverables targeted for the upcoming sprint.
        </p>
        <textarea
          rows={4}
          value={nextWeekTasks}
          onChange={(e) => setNextWeekTasks(e.target.value)}
          placeholder="- Deliver high-fidelity modal mockups&#10;- Setup unit test coverage for report state&#10;- Deploy release candidate v2.1"
          className="w-full rounded-lg border border-[#E5E7E5] bg-[#F7F8F7]/50 p-3 text-xs text-[#171A18] focus:border-[#171A18] outline-none leading-relaxed font-mono"
        />
      </div>

      {/* Blockers / Challenges */}
      <BlockerSection
        blockers={blockers}
        onAddBlocker={handleAddBlocker}
        onRemoveBlocker={handleRemoveBlocker}
        onToggleResolved={handleToggleBlockerResolved}
        isEditable={true}
      />

      {/* Achievements / Highlights */}
      <AchievementSection
        achievements={achievements}
        onAddAchievement={handleAddAchievement}
        onRemoveAchievement={handleRemoveAchievement}
        isEditable={true}
      />

      {/* Time Distribution */}
      <TimeEntrySection
        timeEntries={timeEntries}
        onAddTimeEntry={handleAddTimeEntry}
        onRemoveTimeEntry={handleRemoveTimeEntry}
        isEditable={true}
      />

      {/* Additional Notes */}
      <div className="rounded-xl border border-[#E5E7E5] bg-white p-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#E5E7E5] pb-3">
          <FileText className="h-4 w-4 text-[#171A18]" />
          <h3 className="text-base font-bold text-[#171A18]">Additional Notes & Feedback</h3>
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any extra comments, context for manager review, or personal reflections..."
          className="w-full rounded-lg border border-[#E5E7E5] bg-[#F7F8F7]/50 p-3 text-xs text-[#171A18] focus:border-[#171A18] outline-none leading-relaxed"
        />
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-[#E5E7E5] bg-white p-4 shadow-lg backdrop-blur-md">
        <div className="text-xs text-[#6B726D]">
          <span className="font-semibold text-[#171A18]">
            {tasks.length} Tasks &bull; {blockers.length} Blockers &bull; {achievements.length} Highlights
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleFormAction(false)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7E5] bg-white px-4 py-2 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4 text-[#6B726D]" />
            {isEdit ? 'Save Draft Changes' : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={() => handleFormAction(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#8DF688] px-5 py-2 text-xs font-bold text-[#171A18] hover:bg-[#7ae875] transition-colors shadow-xs cursor-pointer"
          >
            <Send className="h-4 w-4" />
            {isEdit ? 'Resubmit Report' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};
