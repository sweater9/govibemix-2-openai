export type TrackKind = "audio" | "midi";

export interface Clip {
  id: string;
  name: string;
  start: number;
  duration: number;
  color: string;
}

export interface Track {
  id: string;
  name: string;
  kind: TrackKind;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  armed: boolean;
  clips: Clip[];
}

export interface Project {
  schemaVersion: 1;
  id: string;
  name: string;
  tempo: number;
  timeSignature: [number, number];
  updatedAt: string;
  tracks: Track[];
}

export const createProject = (): Project => ({
  schemaVersion: 1,
  id: crypto.randomUUID(),
  name: "Midnight Session",
  tempo: 124,
  timeSignature: [4, 4],
  updatedAt: new Date().toISOString(),
  tracks: [
    { id: "drums", name: "Drum Machine", kind: "midi", volume: 0.82, pan: 0, muted: false, solo: false, armed: false, clips: [{ id: "beat-a", name: "Neon Beat", start: 0, duration: 8, color: "#8b5cf6" }, { id: "beat-b", name: "Neon Beat", start: 8, duration: 8, color: "#8b5cf6" }] },
    { id: "bass", name: "Sub Bass", kind: "midi", volume: 0.7, pan: -0.08, muted: false, solo: false, armed: false, clips: [{ id: "bass-a", name: "Low Motion", start: 0, duration: 16, color: "#06b6d4" }] },
    { id: "vocal", name: "Lead Vocal", kind: "audio", volume: 0.76, pan: 0.05, muted: false, solo: false, armed: true, clips: [{ id: "vocal-a", name: "Verse Take 03", start: 4, duration: 7.5, color: "#f43f5e" }] },
    { id: "texture", name: "Atmosphere", kind: "audio", volume: 0.54, pan: 0.2, muted: false, solo: false, armed: false, clips: [{ id: "texture-a", name: "Night Air", start: 0, duration: 16, color: "#22c55e" }] }
  ]
});

