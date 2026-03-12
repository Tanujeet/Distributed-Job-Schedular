import redis from "../../../packages/redis/src";

const LOCK_KEY = "scheduler-leader";
const LOCK_TTL = 15000;

export async function tryBecomeLeader(): Promise<boolean> {
  const result = await redis.call(
    "SET",
    LOCK_KEY,
    "true",
    "NX",
    "PX",
    LOCK_TTL,
  );

  return result === "OK";
}

export async function renewLeader() {
  await redis.pexpire(LOCK_KEY, LOCK_TTL);
}
