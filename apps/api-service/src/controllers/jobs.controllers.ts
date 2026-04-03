import { Request, Response } from "express";
import { generateId } from "@repo/utils";
import { query } from "@repo/database";
import { parseExpression } from "cron-parser";

export const createJob = async (req: Request, res: Response) => {
  try {
    const { name, cron_expression, payload, retry_count, timeout } = req.body;

    const id = generateId();

    const interval = parseExpression(cron_expression, {
      currentDate: new Date(),
      tz: "UTC",
    });

    const nextRun = interval.next().toDate();

    await query(
      `INSERT INTO jobs
       (id,name,cron_expression,payload,retry_count,timeout,next_run_at,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'active')`,
      [
        id,
        name,
        cron_expression,
        payload,
        retry_count || 3,
        timeout || 60,
        nextRun,
      ],
    );

    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "job creation failed" });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(`SELECT * FROM jobs WHERE id=$1`, [id]);

    if (!result.rows.length) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET JOB ERROR:", err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

export const getJobs = async (_: Request, res: Response) => {
  const jobs = await query(`SELECT * FROM jobs ORDER BY created_at DESC`);
  res.json(jobs.rows);
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE jobs SET status='deleted', updated_at=NOW() WHERE id=$1 RETURNING id`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ success: true, message: "Job deleted" });
  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    res.status(500).json({ error: "Failed to delete job" });
  }
};

export const pauseJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE jobs SET status='paused', updated_at=NOW()
       WHERE id=$1 AND status='active'
       RETURNING id`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Job not found or not active" });
    }

    res.json({ success: true, message: "Job paused" });
  } catch (err) {
    console.error("PAUSE JOB ERROR:", err);
    res.status(500).json({ error: "Failed to pause job" });
  }
};

export const resumeJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Recompute next_run_at from now when resuming
    const jobResult = await query(
      `SELECT cron_expression FROM jobs WHERE id=$1 AND status='paused'`,
      [id],
    );

    if (!jobResult.rows.length) {
      return res.status(400).json({ error: "Job not found or not paused" });
    }

    const { cron_expression } = jobResult.rows[0];
    const interval = parseExpression(cron_expression, {
      currentDate: new Date(),
      tz: "UTC",
    });
    const nextRun = interval.next().toDate();

    await query(
      `UPDATE jobs SET status='active', next_run_at=$1, updated_at=NOW() WHERE id=$2`,
      [nextRun, id],
    );

    res.json({ success: true, message: "Job resumed", next_run_at: nextRun });
  } catch (err) {
    console.error("RESUME JOB ERROR:", err);
    res.status(500).json({ error: "Failed to resume job" });
  }
};

export const getExecutions = async (req: Request, res: Response) => {
  const { id } = req.params;

  const executions = await query(
    `SELECT * FROM job_executions WHERE job_id=$1 ORDER BY started_at DESC`,
    [id],
  );

  res.json(executions.rows);
};
