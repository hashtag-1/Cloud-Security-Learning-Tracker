import "@testing-library/jest-dom";
import { expect, describe, it, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});