export type JobStatus = "active" | "running" | "success" | "failed" | "pending";

export interface Job {
  id: string;
  name: string;
  cron: string;
  payload: Record<string, any>;
  retryCount: number;
  timeout: number;
  status: JobStatus;
  nextRun?: string;
  lastRun?: string | null;
}

export interface Execution {
  id: string;
  jobId: string;
  attempt: number;
  startTime: string;
  duration?: number;
  status: JobStatus;
  error?: string;
}

export interface Worker {
  id: string;
  status: "online" | "offline";
  jobsExecuting: number;
  uptime: string;
}
