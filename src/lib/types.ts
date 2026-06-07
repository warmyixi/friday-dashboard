export type TodoItem = {
  id: number;
  content: string;
  priority: string;
  priority_label: string;
  due_at: string | null;
  status: string;
  created_at: string | null;
};

export type ScheduleItem = {
  id: number;
  job_type: string;
  job_type_label: string;
  message: string;
  run_at: string | null;
  recurrence: Record<string, unknown> | null;
  recurrence_label: string;
  status: string;
};

export type CalendarItem = {
  id: string | null;
  title: string;
  start: string | null;
  end: string | null;
  all_day: boolean;
  location: string;
};

/** Matches bot `HOME_STATE.bedroom` — devices are not at home_state root. */
export type BedroomFloorLamp = {
  state: string;
};

export type BedroomFan = {
  state: string;
  power: number;
};

export type BedroomAc = {
  hvac_mode: string;
  temperature: number | null;
  fan_mode: string;
  current_temperature: number | null;
};

export type BedroomDeviceState = {
  floor_lamp: BedroomFloorLamp;
  fan: BedroomFan;
  ac: BedroomAc;
};

/** Matches bot `HOME_STATE` snapshot from /api/dashboard. */
export type HomeState = {
  bedroom: BedroomDeviceState;
  last_updated: string | null;
  last_source: string | null;
};

export type Presence = {
  is_home: boolean;
  last_changed: string | null;
  ha_state?: string | null;
  entity_id?: string | null;
  source?: string | null;
};

export type DashboardErrors = {
  todos: string | null;
  schedules: string | null;
  calendar: string | null;
  home_state?: string | null;
};

export type DashboardSnapshot = {
  user_id: string;
  todos: TodoItem[];
  schedules: ScheduleItem[];
  calendar: CalendarItem[];
  calendar_days_ahead: number;
  home_state: HomeState;
  presence: Presence;
  errors: DashboardErrors;
  updated_at: string;
};

export type DashboardFetchState = {
  data: DashboardSnapshot | null;
  error: string | null;
  loading: boolean;
  lastFetchedAt: string | null;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type CommandResponse = {
  ok: boolean;
  replies: string[];
  error?: string;
  message?: string;
};
