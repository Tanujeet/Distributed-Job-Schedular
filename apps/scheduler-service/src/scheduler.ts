import { query } from "../../../packages/database/src";
import { parseExpression } from "cron-parser";
import redis from "../../../packages/redis/src";
import { generateId, sleep } from "../../../packages/utils/src";
import { renewLeader } from "./leader";

export async function runScheduler() {
  console.log("Scheduler loop started");

  while (true) {
    try {
      const jobs = await query(`
        SELECT *
        FROM jobs
        WHERE status='active'
        AND next_run_at <= NOW()
        FOR UPDATE SKIP LOCKED
        LIMIT 20
      `);
      console.log("Jobs fetched:", jobs.rows.length);

      for (const job of jobs.rows) {
        const executionId = generateId();

        await query(
          `INSERT INTO job_executions
           (id, job_id, status, attempt)
           VALUES ($1,$2,$3,$4)`,
          [executionId, job.id, "queued", 0],
        );

        try {
          const pushResult = await redis.lpush(
            "job-queue",
            JSON.stringify({
              executionId,
              jobId: job.id,
              payload: job.payload,
              retry: job.retry_count,
              timeout: job.timeout,
            }),
          );
          console.log("📤 Pushed to Redis, queue length:", pushResult);
        } catch (redisErr) {
          console.error("❌ Redis push failed:", redisErr);
        }

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

        console.log("Job queued:", job.name);
      }

      await renewLeader();
    } catch (err) {
      console.error("scheduler error", err);
    }

    await sleep(2000);
  }
}
