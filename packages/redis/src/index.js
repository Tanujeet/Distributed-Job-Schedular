"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redis = new ioredis_1.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    db: 0,
});
exports.redis.on("connect", async () => {
    console.log("✅ Redis connected");
    // Test
    await exports.redis.lpush("test-queue", "hello");
    const val = await exports.redis.rpop("test-queue");
    console.log("🧪 Redis test:", val);
});
exports.redis.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
exports.default = exports.redis;
