import { describe, it, expect } from "vitest";
import { cn, formatDate, formatDuration, formatNumber, clamp, roundTo } from "@/lib/utils";

describe("cn", () => {
  it("merges class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2024-01-15T00:00:00.000Z");
    expect(result).toBe("Jan 15, 2024");
  });

  it("handles Date objects", () => {
    const date = new Date("2024-06-01");
    const result = formatDate(date);
    expect(result).toBe("Jun 1, 2024");
  });
});

describe("formatDuration", () => {
  it("returns minutes for < 60 minutes", () => {
    expect(formatDuration(30)).toBe("30m");
  });

  it("returns hours for >= 60 minutes", () => {
    expect(formatDuration(90)).toBe("1h 30m");
  });

  it("returns hours only for exact hour", () => {
    expect(formatDuration(120)).toBe("2h");
  });

  it("handles 0", () => {
    expect(formatDuration(0)).toBe("0m");
  });
});

describe("formatNumber", () => {
  it("formats thousands", () => {
    expect(formatNumber(1500)).toBe("1.5K");
  });

  it("formats millions", () => {
    expect(formatNumber(2500000)).toBe("2.5M");
  });

  it("returns small numbers as-is", () => {
    expect(formatNumber(42)).toBe("42");
  });
});

describe("clamp", () => {
  it("clamps to max", () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it("clamps to min", () => {
    expect(clamp(-10, 0, 100)).toBe(0);
  });

  it("returns value within range", () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });
});

describe("roundTo", () => {
  it("rounds to 1 decimal", () => {
    expect(roundTo(3.14159, 1)).toBe(3.1);
  });

  it("rounds to 2 decimals", () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
  });
});
