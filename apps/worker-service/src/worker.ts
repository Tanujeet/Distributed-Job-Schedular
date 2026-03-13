import redis from "../../../packages/redis/src";
import { query } from "../../../packages/database/src";

async function executeJob(payload: any) {
  console.log("Executing job with payload:", payload);
  await new Promise((r) => setTimeout(r, 2000));
}

async function processJob(job: any) {
  const { executionId, jobId, payload, retry, timeout } = job;

  try {
    // ✅ Guard: skip if job was paused or deleted after being queued
    const jobCheck = await query(`SELECT status FROM jobs WHERE id=$1`, [
      jobId,
    ]);

    if (!jobCheck.rows.length || jobCheck.rows[0].status !== "active") {
      console.log(
        `⏭️ Skipping execution ${executionId} — job is ${jobCheck.rows[0]?.status ?? "missing"}`,
      );

      await query(
        `UPDATE job_executions SET status='cancelled', finished_at=NOW() WHERE id=$1`,
        [executionId],
      );
      return;
    }

    const result = await query(
      `UPDATE job_executions
       SET status='running', started_at=NOW()
       WHERE id=$1 AND status='queued'
       RETURNING id`,
      [executionId],
    );

    if (result.rowCount === 0) {
      console.log("Job already taken by another worker");
      return;
    }

    await Promise.race([
      executeJob(payload),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout exceeded")), timeout * 1000),
      ),
    ]);

    await query(
      `UPDATE job_executions SET status='success', finished_at=NOW() WHERE id=$1`,
      [executionId],
    );

    await query(`UPDATE jobs SET last_run_at=NOW() WHERE id=$1`, [jobId]);

    console.log("✅ Job completed:", executionId);
  } catch (err: any) {
    console.error("❌ Job failed:", err.message);

    await query(
      `UPDATE job_executions
       SET status='failed', finished_at=NOW(), error_message=$1
       WHERE id=$2`,
      [err.message, executionId],
    );

    if (retry > 0) {
      console.log("🔄 Retrying job:", executionId);
      await redis.lpush(
        "job-queue",
        JSON.stringify({ ...job, retry: retry - 1 }),
      );
    }
  }
}

async function workerLoop() {
  console.log("Worker loop started");

  while (true) {
    try {
      const payload = await redis.rpop("job-queue");

      if (!payload) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      const job = JSON.parse(payload);
      console.log("📥 Job received:", job.executionId);

      await processJob(job);
    } catch (err) {
      console.error("Worker error:", err);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

export function startWorkerPool() {
  const concurrency = 5;

  for (let i = 0; i < concurrency; i++) {
    workerLoop();
  }

  console.log(`Worker pool started with concurrency ${concurrency}`);
}