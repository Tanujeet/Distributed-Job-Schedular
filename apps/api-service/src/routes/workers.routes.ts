import { Router } from "express";
import redis from "../../../../packages/redis/src/index";

const router = Router();

router.get("/", async (req, res) => {
  const keys = await redis.keys("worker:*");

  const workers = await Promise.all(
    keys.map(async (key) => {
      const data = await redis.hgetall(key);

      return {
        id: data.id,
        status: data.status,
        jobsExecuting: Number(data.jobsExecuting || 0),
        uptime: data.uptime,
      };
    }),
  );

  res.json(workers);
});

export default router;
