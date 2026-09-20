import { z } from "zod";

export const studySessionSchema = z.object({
  date: z.date(),
  duration: z.number().int().positive("Duration must be positive"),
  topicsStudied: z.array(z.string()).min(1, "At least one topic required"),
  notes: z.string().optional(),
  mood: z.enum([
    "FOCUSED",
    "OK",
    "TIRED",
    "DISTRACTED",
    "ENTHUSIASTIC",
  ]).optional(),
  productivityRating: z.enum(["1", "2", "3", "4", "5"]).optional(),
});

export const createLabSchema = z.object({
  name: z.string().min(1, "Lab name is required"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]),
  notes: z.string().optional(),
  skillsLearned: z.array(z.string()).optional(),
});

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  technologies: z.array(z.string()).optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]),
});

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["NOTE", "COMMAND", "CHEAT_SHEET", "CONCEPT"]),
  tags: z.array(z.string()).optional(),
});

export const createRoadmapPhaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  objective: z.string().optional(),
  estimatedWeeks: z.number().int().positive().optional(),
});

export const updateMicrotopicStatusSchema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "REVISION_REQUIRED"]),
});

export const updateRoadmapTopicStatusSchema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "REVISION_REQUIRED"]),
});

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});