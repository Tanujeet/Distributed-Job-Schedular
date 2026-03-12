
import { Job, Execution } from "./types";

export function mapJob(api: any): Job {
  return {
    id: api.id,
    name: api.name,
    cron: api.cron_expression,
    payload: api.payload,
    retryCount: api.retry_count,
    timeout: api.timeout ?? 0,
    status: api.status,
    nextRun: "",
  };
}

export function mapExecution(api: any): Execution {
  const duration =
    api.finished_at && api.started_at
      ? new Date(api.finished_at).getTime() -
        new Date(api.started_at).getTime()
      : undefined;

  return {
    id: api.id,
    jobId: api.job_id,
    attempt: api.attempt,
    startTime: api.started_at,
    duration,
    status: api.status,
    error: api.error_message,
  };
}

