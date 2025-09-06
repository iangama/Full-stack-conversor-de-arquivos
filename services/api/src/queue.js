import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { env } from './lib/env.js';

const baseOpts = { maxRetriesPerRequest: null }; // <- exigido pelo BullMQ

const connection = env.redisUrl
  ? new IORedis(env.redisUrl, baseOpts)
  : new IORedis({ host: env.redis.host, port: env.redis.port, ...baseOpts });

export const convertQueue = new Queue('convert', { connection });
