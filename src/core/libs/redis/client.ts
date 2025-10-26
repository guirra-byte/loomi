import { createClient, RedisClientType } from 'redis';
import { config } from "dotenv";

config();

const { REDIS_URL } = process.env;

let redis: RedisClientType | null = null;
const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redis) {
    redis = await createClient({
      url: REDIS_URL,
    });

    redis.on('error', (err) => {
      console.error('Redis Client Error', err);
      process.exit(1);
    });

    redis.connect();

    const gracefulShutdown = async () => {
      console.log('Closing Redis connection...');
      await redis?.quit();
      process.exit(0);
    };

    process.on('beforeExit', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  }

  return redis;
};

export default getRedisClient();
