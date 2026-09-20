import { describe, it, expect } from "vitest";
import {
  studySessionSchema,
  createLabSchema,
  createNoteSchema,
} from "@/lib/validators";

describe("Zod validation schemas", () => {
  it("validates study session schema with required fields", () => {
    const result = studySessionSchema.safeParse({
      date: new Date("2024-01-15"),
      duration: 60,
      topicsStudied: ["AWS IAM"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects study session without topics", () => {
    const result = studySessionSchema.safeParse({
      date: new Date("2024-01-15"),
      duration: 60,
      topicsStudied: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects study session with negative duration", () => {
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

  it("rejects lab without name", () => {
    const result = createLabSchema.safeParse({
      name: "",
      category: "Test",
      difficulty: "MEDIUM",
      status: "PLANNED",
    });
    expect(result.success).toBe(false);
  });

  it("validates create note schema", () => {
    const result = createNoteSchema.safeParse({
      title: "Test Note",
      content: "Some content",
      type: "NOTE",
    });
    expect(result.success).toBe(true);
  });

  it("rejects note without title", () => {
    const result = createNoteSchema.safeParse({
      title: "",
      content: "Some content",
      type: "NOTE",
    });
    expect(result.success).toBe(false);
  });
});
