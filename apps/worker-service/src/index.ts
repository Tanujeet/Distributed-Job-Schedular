import { startWorkerPool } from "./worker";
import redis from "../../../packages/redis/src";
import { randomUUID } from "crypto";

const workerId = randomUUID();

async function heartbeat() {
  await redis.hset(`worker:${workerId}`, {
    id: workerId,
    status: "online",
    jobsExecuting: "0",
    uptime: Date.now().toString(),
  });
  await redis.expire(`worker:${workerId}`, 10);
}

async function main() {
  await heartbeat();

  setInterval(heartbeat, 5000);

  startWorkerPool();
}

main();
