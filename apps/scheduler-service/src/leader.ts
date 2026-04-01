import redis from "../../../packages/redis/src";
import { generateId } from "../../../packages/utils/src";

const LOCK_KEY = "scheduler-leader";
const LOCK_TTL = 15000;

const INSTANCE_ID = generateId();

export async function tryBecomeLeader(): Promise<boolean> {
    const start = Date.now();
    const result = await redis.call(
      "SET",
      LOCK_KEY,
      INSTANCE_ID,
      "NX",
      "PX",
      LOCK_TTL,
    );
    console.log(`[METRIC] Leader election latency: ${Date.now() - start}ms`);
  return result === "OK";
}

export async function renewLeader() {
  const currentLeader = await redis.get(LOCK_KEY);

  if (currentLeader === INSTANCE_ID) {
    await redis.pexpire(LOCK_KEY, LOCK_TTL);
  }
}
