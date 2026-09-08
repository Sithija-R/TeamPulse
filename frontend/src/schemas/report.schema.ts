import { z } from "zod";

const prioritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

const taskStatusSchema = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "BLOCKED",
]);

const taskTypeSchema = z.enum([
  "DEVELOPMENT",
  "TESTING",
  "MEETINGS",
  "DOCUMENTATION",
  "RESEARCH",
  "OTHER",
]);

const reportTaskRequestSchema = z.object({
  taskName: z
    .string()
    .trim()
    .min(1, "Task name is required"),

  priority: prioritySchema,

  plannedPercentage: z
    .number()
    .min(0, "Planned percentage cannot be negative")
    .max(100, "Planned percentage cannot exceed 100%"),

  actualPercentage: z
    .number()
    .min(0, "Actual percentage cannot be negative")
    .max(100, "Actual percentage cannot exceed 100%"),

  status: taskStatusSchema,

  plannedHours: z
    .number()
    .min(0, "Planned hours cannot be negative")
    .optional(),

  actualHours: z
    .number()
    .min(0, "Actual hours cannot be negative")
    .optional(),

  deliverable: z
    .string()
    .trim()
    .optional(),
});

const blockerRequestSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Blocker description is required"),

  keyIssue: z.boolean(),

  resolved: z.boolean(),
});

const achievementRequestSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Achievement description is required"),

  keyAchievement: z.boolean(),
});

const timeEntryRequestSchema = z.object({
  taskType: taskTypeSchema,

  hours: z
    .number()
    .positive("Hours must be greater than 0"),
});

export const weeklyReportSchema = z
  .object({
    projectId: z
      .number()
      .positive("Please select a project"),

    weekStartDate: z
      .string()
      .min(1, "Week start date is required"),

    weekEndDate: z
      .string()
      .min(1, "Week end date is required"),

    nextWeekTasks: z
      .string()
      .optional(),

    notes: z
      .string()
      .optional(),

    tasks: z
      .array(reportTaskRequestSchema)
      .min(1, "Add at least one task"),

    blockers: z
      .array(blockerRequestSchema),

    achievements: z
      .array(achievementRequestSchema),

    timeEntries: z
      .array(timeEntryRequestSchema),
  })
  .superRefine((data, ctx) => {
    if (
      data.weekStartDate &&
      data.weekEndDate &&
      data.weekEndDate < data.weekStartDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["weekEndDate"],
        message: "Week end date cannot be before the start date",
      });
    }
  });

export type WeeklyReportFormData = z.infer<
  typeof weeklyReportSchema
>;