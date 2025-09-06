import { Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import path from 'path';
import fs from 'fs';
import { env } from './env.js';
import { downloadToFile, uploadFromFile } from './s3.js';
import { libreOfficeConvert, isAllowedTarget, guessContentType } from './convert.js';

const baseOpts = { maxRetriesPerRequest: null }; // <- exigido pelo BullMQ
const connection = env.redisUrl
  ? new IORedis(env.redisUrl, baseOpts)
  : new IORedis({ host: env.redis.host, port: env.redis.port, ...baseOpts });

const queueName = 'convert';
const tmpDir = '/tmp/filex';
fs.mkdirSync(tmpDir, { recursive: true });

async function processJob(job) {
  const { objectKey, targetFormat } = job.data;
  const tgt = String(targetFormat || '').toLowerCase();
  if (!isAllowedTarget(tgt)) throw new Error('targetFormat inválido');

  const localIn = path.join(tmpDir, `in-${job.id}-${path.basename(objectKey)}`);
  const localOutDir = tmpDir;

  await job.updateProgress(10);
  await downloadToFile(env.s3.bucketInput, objectKey, localIn);

  await job.updateProgress(50);
  const outPath = await libreOfficeConvert(localIn, tgt, localOutDir);

  await job.updateProgress(80);
  const outKey = `converted/${path.parse(path.basename(localIn)).name}.${tgt}`;
  const contentType = guessContentType(tgt);
  await uploadFromFile(env.s3.bucketOutput, outKey, outPath, contentType);

  await job.updateProgress(100);
  await connection.hset(`bull:${queueName}:${job.id}`, {
    state: 'completed',
    progress: 100,
    outKey
  });

  try { fs.unlinkSync(localIn); } catch {}
  try { fs.unlinkSync(outPath); } catch {}

  return { outKey };
}

new Worker(queueName, processJob, { connection, concurrency: env.concurrency });
new QueueEvents(queueName, { connection });

console.log('Worker started...');
