export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
};

export const testRedisConfig = {
  host: process.env.TEST_REDIS_HOST,
  port: Number(process.env.TEST_REDIS_PORT),
  password: process.env.TEST_REDIS_PASSWORD,
};
