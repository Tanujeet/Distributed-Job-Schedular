import { Request, Response } from "express";
import { generateId } from "../../../../packages/utils/src";
import { query } from "../../../../packages/database/src";
import { parseExpression } from "cron-parser";

export const createJob = async (req: Request, res: Response) => {
  try {
    const { name, cron_expression, payload, retry_count, timeout } = req.body;

    const id = generateId();

    // compute first run
    const interval = parseExpression(cron_expression, {
      currentDate: new Date(),
      tz:"UTC"
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
  const { id } = req.params;

  await query(`DELETE FROM jobs WHERE id=$1`, [id]);

  res.json({ success: true });
};

export const getExecutions = async (req: Request, res: Response) => {
  const { id } = req.params;

  const executions = await query(
    `SELECT * FROM job_executions WHERE job_id=$1 ORDER BY started_at DESC`,
    [id],
  );

  res.json(executions.rows);
};
