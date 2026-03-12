import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  db: 0,
});

redis.on("connect", async () => {
  console.log("✅ Redis connected");

  // Test
  await redis.lpush("test-queue", "hello");
  const val = await redis.rpop("test-queue");
  console.log("🧪 Redis test:", val);
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;
