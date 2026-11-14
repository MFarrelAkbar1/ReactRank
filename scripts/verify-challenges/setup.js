// Make Jest-style tests (as run by Sandpack) work under Vitest.
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

globalThis.jest = vi;
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
