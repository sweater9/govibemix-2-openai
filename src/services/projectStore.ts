import { invoke } from "@tauri-apps/api/core";
import type { Project } from "../domain/project";

const FALLBACK_KEY = "govibemix:active-project";

const isTauri = () => "__TAURI_INTERNALS__" in window;

export async function saveProject(project: Project): Promise<string> {
  const next = { ...project, updatedAt: new Date().toISOString() };
  const serialized = JSON.stringify(next);
  if (isTauri()) return invoke<string>("save_project", { projectJson: serialized });
  localStorage.setItem(FALLBACK_KEY, serialized);
  return "browser-local";
}

export async function loadProject(fallback: Project): Promise<Project> {
  try {
    const serialized = isTauri()
      ? await invoke<string | null>("load_project", { projectId: fallback.id })
      : localStorage.getItem(FALLBACK_KEY);
    return serialized ? (JSON.parse(serialized) as Project) : fallback;
  } catch {
    return fallback;
  }
}

