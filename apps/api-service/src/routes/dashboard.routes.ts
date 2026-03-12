import { Router } from "express";
import pool from "../../../../packages/database/src/index";
import redis from "../../../../packages/redis/src";

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
      ORDER BY created_at DESC
      LIMIT 10
    `);

    const stats = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status='active') as active,
        COUNT(*) FILTER (WHERE status='failed') as failed
      FROM jobs
    `);

    const workerKeys = await redis.keys("worker:*");

    const workersRaw = await Promise.all(
      workerKeys.map(async (key) => {
        const raw = await redis.get(key);
        if (!raw) return null;
        const data = JSON.parse(raw);
        return {
          id: data.id,
          status: data.status,
          jobsExecuting: 0,
          uptime: data.lastSeen,
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
