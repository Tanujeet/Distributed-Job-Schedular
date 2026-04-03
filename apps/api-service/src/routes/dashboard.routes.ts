import { Router } from "express";
import pool from "@repo/database";
import redis from "@repo/redis";

type JobRow = {
  id: string;
  name: string;
  cron_expression: string;
  status: string;
  last_run_at: string | null;
};

const router = Router();

router.get("/", async (req, res) => {
  try {
    const jobs = await pool.query(`
      SELECT id, name, cron_expression, status, last_run_at
      FROM jobs
      WHERE status != 'deleted'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    const stats = await pool.query(`
      SELECT
      COUNT(*) FILTER (WHERE status != 'deleted') as total,
      COUNT(*) FILTER (WHERE status = 'active') as active,
      COUNT(*) FILTER (WHERE status = 'failed') as failed
      FROM jobs
    `);

    const workerKeys = await redis.keys("worker:*");

    const workersRaw = await Promise.all(
      workerKeys.map(async (key) => {
        const data = await redis.hgetall(key);
        if (!data || !data.id) return null;
        return {
          id: data.id,
          status: data.status,
          jobsExecuting: Number(data.jobsExecuting || 0),
          uptime: data.uptime,
        };
      }),
    );

    const workers = workersRaw.filter(Boolean);

    res.json({
      jobs: jobs.rows.map((j: JobRow) => ({
        id: j.id,
        name: j.name,
        cron: j.cron_expression,
        status: j.status,
        lastRun: j.last_run_at ?? null, 
      })),

      stats: {
        total: Number(stats.rows[0].total),
        active: Number(stats.rows[0].active), 
        failed: Number(stats.rows[0].failed),
        workers: workers.length,
      },

      workers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "dashboard fetch failed" });
  }
});

export default router;
