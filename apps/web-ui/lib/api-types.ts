
export type ApiJobStatus = "success" | "running" | "failed" | "pending";

export interface ApiJob {
  id: string;
  name: string;
  cron_expression: string;
  payload: Record<string, any>;
  retry_count: number;
  timeout: number;
  status: ApiJobStatus;
  created_at?: string;
}

export interface ApiExecution {
  id: string;
  job_id: string;
  attempt: number;
  started_at: string;
  finished_at: string | null;
  status: ApiJobStatus;
  error_message?: string;
}

