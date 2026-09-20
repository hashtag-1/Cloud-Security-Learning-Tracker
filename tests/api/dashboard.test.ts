import { describe, it, expect } from "vitest";
import {
  studySessionSchema,
  createLabSchema,
  createProjectSchema,
  createNoteSchema,
  updateMicrotopicStatusSchema,
  updateRoadmapTopicStatusSchema,
  createRoadmapPhaseSchema,
} from "@/lib/validators";

describe("Zod validation schemas", () => {
  it("validates study session schema", () => {
    const result = studySessionSchema.safeParse({
      date: new Date("2024-01-15"),
      duration: 60,
      topicsStudied: ["AWS IAM"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty topics", () => {
    const result = studySessionSchema.safeParse({
      date: new Date("2024-01-15"),
      duration: 60,
      topicsStudied: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative duration", () => {
    const result = studySessionSchema.safeParse({
      date: new Date("2024-01-15"),
      duration: -5,
      topicsStudied: ["test"],
    });
    expect(result.success).toBe(false);
  });

  it("validates create lab schema", () => {
    const result = createLabSchema.safeParse({
      name: "Test Lab",
      category: "Cloud Computing",
      difficulty: "MEDIUM",
      status: "PLANNED",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty lab name", () => {
    const result = createLabSchema.safeParse({
      name: "", category: "Test", difficulty: "MEDIUM", status: "PLANNED",
    });
    expect(result.success).toBe(false);
  });

  it("validates create project schema", () => {
    const result = createProjectSchema.safeParse({
      name: "Test Project", status: "PLANNED",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty project name", () => {
    const result = createProjectSchema.safeParse({ name: "", status: "PLANNED" });
    expect(result.success).toBe(false);
  });

  it("validates create note schema", () => {
    const result = createNoteSchema.safeParse({
      title: "Test Note", content: "Content", type: "NOTE",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty note title", () => {
    const result = createNoteSchema.safeParse({
      title: "", content: "Content", type: "NOTE",
    });
    expect(result.success).toBe(false);
  });

  it("validates microtopic status update", () => {
    const result = updateMicrotopicStatusSchema.safeParse({ status: "IN_PROGRESS" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = updateMicrotopicStatusSchema.safeParse({ status: "INVALID" });
    expect(result.success).toBe(false);
  });

  it("validates topic status update", () => {
    const result = updateRoadmapTopicStatusSchema.safeParse({ status: "COMPLETED" });
    expect(result.success).toBe(true);
  });

  it("validates roadmap phase schema", () => {
    const result = createRoadmapPhaseSchema.safeParse({
      title: "Phase 1", objective: "Test", estimatedWeeks: 4,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty phase title", () => {
    const result = createRoadmapPhaseSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("validates roadmap topic update schema", () => {
    const result = updateRoadmapTopicStatusSchema.safeParse({ status: "IN_PROGRESS" });
    expect(result.success).toBe(true);
  });
});
