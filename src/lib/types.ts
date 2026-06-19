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
  projects?: string | null;
};

export type ProjectChecklistItem = {
  item_key: string;
  label: string;
  state: string;
  value_text: string | null;
  updated_at: string | null;
};

export type MaintenancePlan = {
  key: string;
  label: string;
  interval_days: number | null;
  filters: number | null;
};

export type ProjectTemplate = {
  id: string;
  label: string;
  description: string;
  project_type: string;
  asset_label: string;
  features: Record<string, boolean>;
  maintenance_plans: MaintenancePlan[];
};

export type ProjectBillingDefaults = {
  consumables_by_owner?: boolean;
  labor_wage_per_visit?: boolean;
  parts_self_purchase_on_repair?: boolean;
};

export type MaintenanceSchedule = {
  last_minor_at: string | null;
  next_minor_at: string | null;
  last_major_at: string | null;
  next_major_at: string | null;
  last_repair_at: string | null;
  last_service_at?: string | null;
  last_service_type?: string | null;
  next_service_at?: string | null;
  next_service_type?: "minor_3m" | "major_6m" | null;
  minors_since_major?: number;
};

export type MaintenanceRound = {
  id: number;
  round_key: string;
  label: string;
  work_year: number | null;
  work_month: number | null;
  status: string;
  copied_from_round_id: number | null;
  started_at: string | null;
  completed_at: string | null;
};

export type ProjectAsset = {
  id: number;
  code: string;
  name: string;
  asset_type: string;
  status: string;
  block_reason: string | null;
  block_reason_label: string | null;
  notes: string | null;
  maps_url: string | null;
  gps_lat: number | null;
  gps_lng: number | null;
  completed_at: string | null;
  round_id?: number | null;
  maintenance_schedule?: MaintenanceSchedule | null;
  checklist: ProjectChecklistItem[];
};

export type ProjectProgressMetric = {
  completed: number;
  total: number;
  progress_pct: number;
  label: string;
  note: string;
  display: string;
};

export type ProjectProgress = {
  total: number;
  completed: number;
  blocked: number;
  skipped: number;
  pending: number;
  in_progress: number;
  actionable_total: number;
  overall: ProjectProgressMetric;
  actionable: ProjectProgressMetric;
  remaining_codes: string[];
  blocked_assets: Array<{
    code: string;
    block_reason: string | null;
    block_reason_label: string | null;
  }>;
  skipped_assets: Array<{
    code: string;
    notes: string | null;
    metadata: Record<string, unknown>;
  }>;
};

export type ProjectIssue = {
  id: number;
  title: string;
  status: string;
  issue_type: string | null;
  asset_code: string | null;
  description: string | null;
  opened_at: string | null;
};

export type ProjectWorkLog = {
  id: number;
  asset_code: string | null;
  action: string;
  worked_at: string | null;
  note: string | null;
  duration_minutes: number | null;
  metadata: Record<string, unknown>;
};

export type ProjectSnapshot = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  project_type: string;
  template_id?: string | null;
  template_label?: string;
  features?: Record<string, boolean>;
  maintenance_plans?: MaintenancePlan[];
  billing_defaults?: ProjectBillingDefaults;
  fixed?: boolean;
  active_round?: MaintenanceRound | null;
  viewing_round?: MaintenanceRound | null;
  viewing_round_id?: number | null;
  rounds?: MaintenanceRound[];
  progress_pct: number;
  progress: ProjectProgress;
  assets: ProjectAsset[];
  work_logs?: ProjectWorkLog[];
  issues: ProjectIssue[];
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
  projects?: ProjectSnapshot[];
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
