import { startWorkerPool } from "./worker";
import redis from "../../../packages/redis/src";
import { randomUUID } from "crypto";

const workerId = randomUUID();

async function heartbeat() {
  await redis.set(
    `worker:${workerId}`,
    JSON.stringify({
      id: workerId,
      status: "online",
      lastSeen: Date.now(),
    }),
    "EX",
    10,
  );
}

async function main() {
  await heartbeat();

  setInterval(heartbeat, 5000);

  startWorkerPool();
}

main();
