export interface Job {
  id: string;
  name: string;
  cron_expression: string;
  payload: any;
  status: "active" | "paused" | "deleted";
  retry_count: number;
  timeout: number;
  created_at: Date;
  updated_at: Date;
}

export interface JobExecution {
  id: string;
  job_id: string;
  status: string;
  started_at?: Date;
  finished_at?: Date;
  attempt: number;
  error_message?: string;
}
