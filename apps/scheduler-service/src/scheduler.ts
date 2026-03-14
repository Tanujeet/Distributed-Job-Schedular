import { query } from "../../../packages/database/src";
import { parseExpression } from "cron-parser";
import redis from "../../../packages/redis/src";
import { generateId, sleep } from "../../../packages/utils/src";
import { renewLeader } from "./leader";

async function pushToRedis(payload: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await redis.lpush("job-queue", JSON.stringify(payload));
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(500);
    }
  }
}

export async function runScheduler() {
  console.log("Scheduler loop started");

  while (true) {
    try {
      await query("BEGIN");

      const jobs = await query(`
        SELECT *
        FROM jobs
        WHERE status='active'
        AND next_run_at <= NOW()
        FOR UPDATE SKIP LOCKED
        LIMIT 20
      `);

      const queuedExecutions: any[] = [];

      for (const job of jobs.rows) {
        const executionId = generateId();

        await query(
          `INSERT INTO job_executions
           (id, job_id, status, attempt)
           VALUES ($1,$2,$3,$4)`,
          [executionId, job.id, "queued", 0],
        );

        const interval = parseExpression(job.cron_expression, {
          currentDate: new Date(),
          tz: "UTC",
        });

        const nextRun = interval.next().toDate();

        await query(
          `UPDATE jobs
           SET next_run_at=$1
           WHERE id=$2`,
          [nextRun, job.id],
        );

        queuedExecutions.push({
          executionId,
          jobId: job.id,
          payload: job.payload,
          retry: job.retry_count,
          timeout: job.timeout,
        });
      }

      await query("COMMIT");

      for (const payload of queuedExecutions) {
        try {
          await pushToRedis(payload);
          console.log("📤 Job queued:", payload.jobId);
        } catch (err) {
          console.error("❌ Redis push failed:", err);
        }
      }

      await renewLeader();
    } catch (err) {
      await query("ROLLBACK");
      console.error("scheduler error", err);
    }

    await sleep(10000);
  }
}
