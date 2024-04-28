import Redis, { RedisKey, RedisValue } from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL!);

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

export default redisClient;
