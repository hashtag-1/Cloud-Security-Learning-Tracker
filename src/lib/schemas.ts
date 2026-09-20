import { z } from "zod";

import { studySessionSchema } from "./validators";
export { studySessionSchema };

export const roadmapPhaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  objective: z.string().optional(),
  estimatedWeeks: z.number().int().positive().optional(),
  topics: z
    .array(
      z.object({
        title: z.string().min(1),
        objective: z.string().optional(),
        microtopics: z
          .array(
            z.object({
              title: z.string().min(1),
              description: z.string().optional(),
              depth: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export const roadmapTopicUpdateSchema = z.object({
  status: z.enum([
    "NOT_STARTED",
    "IN_PROGRESS",
    "COMPLETED",
    "REVISION_REQUIRED",
  ]),
});

export const roadmapMicrotopicUpdateSchema = z.object({
  status: z.enum([
    "NOT_STARTED",
    "IN_PROGRESS",
    "COMPLETED",
    "REVISION_REQUIRED",
  ]),
});

export const dashboardStatsSchema = z.object({
  totalStudyHours: z.number(),
  currentStreak: z.number(),
  currentPhase: z.string(),
  roadmapCompletion: z.number(),
  labsCompleted: z.number(),
  projectsCompleted: z.number(),
  weeklyHours: z.number(),
  monthlyHours: z.number(),
});

export type RoadmapPhaseFormData = z.infer<typeof roadmapPhaseSchema>;
export type StudySessionFormData = z.infer<typeof studySessionSchema>;