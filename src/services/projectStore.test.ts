import { beforeEach, describe, expect, it, vi } from "vitest";
import { createProject } from "../domain/project";
import { loadProject, saveProject } from "./projectStore";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

describe("offline project store", () => {
  beforeEach(() => localStorage.clear());
  it("persists and reloads a project in browser fallback storage", async () => {
    const project = createProject();
    project.name = "Offline draft";
    await saveProject(project);
    expect((await loadProject(createProject())).name).toBe("Offline draft");
  });
});

