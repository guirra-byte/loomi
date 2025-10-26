import { createClient, RedisClientType } from 'redis';

let redis: RedisClientType | null = null;
const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redis) {
    redis = createClient();
    await redis.connect();

    redis.on('error', (err) => {
      console.error('Redis Client Error', err);
      process.exit(1);
    });

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
