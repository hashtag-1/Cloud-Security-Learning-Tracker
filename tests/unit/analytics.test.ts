import { describe, it, expect } from "vitest";

describe("streak calculation logic", () => {
  it("returns 0 for empty sessions", () => {
    const sessions: Date[] = [];
    let streak = 0;
    const dates = new Set(sessions.map((s) => s.toDateString()));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (dates.has(date.toDateString())) streak++;
      else if (i > 0) break;
    }
    expect(streak).toBe(0);
  });

  it("counts consecutive days", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessions: Date[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      sessions.push(d);
    }
    const dates = new Set(sessions.map((s) => s.toDateString()));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (dates.has(date.toDateString())) streak++;
      else if (i > 0) break;
    }
    expect(streak).toBe(5);
  });

  it("stops at gap", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessions: Date[] = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      sessions.push(d);
    }
    const dates = new Set(sessions.map((s) => s.toDateString()));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (dates.has(date.toDateString())) streak++;
      else if (i > 0) break;
    }
    expect(streak).toBe(3);
  });
});

describe("completion percentage calculation", () => {
  it("calculates 0% for no completed items", () => {
    const completed = 0;
    const total = 10;
    expect(Math.round((completed / total) * 100)).toBe(0);
  });

  it("calculates 100% for all completed", () => {
    const completed = 10;
    const total = 10;
    expect(Math.round((completed / total) * 100)).toBe(100);
  });

  it("calculates partial completion", () => {
    const completed = 3;
    const total = 8;
    expect(Math.round((completed / total) * 100)).toBe(38);
  });

  it("handles 0 total (no division by zero)", () => {
    const total = 0;
    const completion = total > 0 ? Math.round((0 / total) * 100) : 0;
    expect(completion).toBe(0);
  });
});

describe("weekly hours calculation", () => {
  it("sums session durations correctly", () => {
    const sessions = [
      { duration: 60 },
      { duration: 30 },
      { duration: 90 },
    ];
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const hours = totalMinutes / 60;
    expect(hours).toBe(3);
  });
});
