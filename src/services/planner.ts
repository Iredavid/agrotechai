import { auth } from "./firebase";

const API_BASE: string = import.meta.env.VITE_API_BASE_URL ?? "";

export const PLANNER_CROPS = [
  "maize", "rice", "millet", "sorghum", "cassava", "yam", "cocoa", "oil_palm",
] as const;

export interface PlanTask {
  id: string;
  kind: string;
  title: string;
  due: string; // ISO date
  due_end: string | null;
  details: string;
  source: string;
}

export interface Outlook {
  source: "daily_history" | "monthly_climatology" | "unavailable";
  years_used: number;
  typical_onset: string | null;
  onset_range: [string, string] | null;
  typical_cessation: string | null;
  observed_onset_this_year: { date: string; confirmed: boolean } | null;
  season_year: number;
  caveat: string;
}

export interface PlantingWindow {
  start: string;
  end: string;
  anchor: string;
  anchor_type: string;
}

export interface PlanWarning {
  level: "warning" | "info";
  message: string;
}

export interface Plan {
  id: string;
  crop: string;
  plot_name: string | null;
  planting_date: string;
  scope: "full_season" | "establishment_year";
  tasks: PlanTask[];
  completed: Record<string, boolean>;
  warnings: PlanWarning[];
  outlook: Outlook;
  window: PlantingWindow | null;
}

export interface Improvement {
  id: string;
  title: string;
  why: string;
  action: string;
  priority: "high" | "medium" | "low";
}

export interface Insights {
  weather_notes: Record<string, string>;
  weather_available: boolean;
  improvements: Improvement[];
  briefing: {
    summary: string;
    priorities: string[];
    tips: string[];
    source: "ai" | "template";
  };
}

export interface NewPlanInput {
  crop: string;
  planting_date: string;
  plot_name?: string;
  lat: number;
  lon: number;
  farm_size_ha: number;
  state?: string | null;
  irrigation_type?: string | null;
  features: Record<string, unknown>;
  farm_health_score?: number | null;
  soil_moisture?: number | null;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    throw new Error(
      typeof detail === "string" ? detail : `Request failed (${res.status})`,
    );
  }
  return res.json() as Promise<T>;
}

export const getSeason = (crop: string, lat: number, lon: number) =>
  request<{ outlook: Outlook; window: PlantingWindow | null }>("/planner/season", {
    method: "POST",
    body: JSON.stringify({ crop, lat, lon }),
  });

export const listPlans = () => request<Plan[]>("/planner/plans");

export const createPlan = (input: NewPlanInput) =>
  request<Plan>("/planner/plans", { method: "POST", body: JSON.stringify(input) });

export const setTaskCompleted = (planId: string, taskId: string, completed: boolean) =>
  request<{ ok: boolean }>(`/planner/plans/${planId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });

export const archivePlan = (planId: string) =>
  request<{ ok: boolean }>(`/planner/plans/${planId}`, { method: "DELETE" });

export const getInsights = (planId: string) =>
  request<Insights>(`/planner/plans/${planId}/insights`, { method: "POST" });

// ---------------------------------------------------------------------------
// Dashboard overview: next tasks, insights and recent activity in ONE request.
// No AI call on the server, so it is cheap to call on every dashboard load.
// ---------------------------------------------------------------------------

export interface OverviewTask {
  id: string;
  plan_id: string;
  crop: string;
  plot_name: string | null;
  title: string;
  type: string; // task kind, e.g. "fertilizer", "weeding"
  date: string; // ISO due date
  date_end: string | null;
  status: "overdue" | "due_today" | "upcoming";
}

export interface OverviewInsight {
  id: string;
  type: "weather" | "planting" | "improvement";
  level: "warning" | "info" | "success";
  title: string;
  message: string;
}

export interface ActivityItem {
  id: string;
  event: "plan_created" | "task_completed" | "plan_removed";
  type: "success" | "info" | "alert"; // matches the dashboard feed's colour keys
  title: string;
  description: string;
  created_at: string; // ISO, UTC
  time: string; // same as created_at
}

export interface Overview {
  plans_count: number;
  next_tasks: OverviewTask[];
  insights: OverviewInsight[];
  activity: ActivityItem[];
  weather_available: boolean;
  weather_advisory: unknown | null; // passed through if your /forecast adds one
}

export interface OverviewInput {
  lat?: number;
  lon?: number;
  top_crop?: string;
  irrigation_type?: string | null;
  features?: Record<string, unknown>;
  farm_health_score?: number | null;
  soil_moisture?: number | null;
}

export const getOverview = (input: OverviewInput = {}) =>
  request<Overview>("/planner/overview", { method: "POST", body: JSON.stringify(input) });

/** "5 minutes ago", "2 hours ago", "3 days ago" for an ISO timestamp. */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const seconds = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const units: [number, string][] = [[86400, "day"], [3600, "hour"], [60, "minute"]];
  for (const [size, name] of units) {
    if (seconds >= size) {
      const n = Math.floor(seconds / size);
      return `${n} ${name}${n === 1 ? "" : "s"} ago`;
    }
  }
  return "Just now";
}
