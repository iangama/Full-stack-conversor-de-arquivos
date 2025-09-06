import express from 'express';
import cors from 'cors';
import multer from 'multer';
import IORedis from 'ioredis';
import { env } from './lib/env.js';
import { ensureBucket, putObject, signedDownloadUrl } from './lib/s3.js';
import { convertQueue } from './queue.js';
import { buildGraph } from './graphql.js';

const upload = multer({ limits: { fileSize: env.maxUploadMb * 1024 * 1024 } });
const app = express();
app.use(cors());
app.use(express.json());

const baseOpts = { maxRetriesPerRequest: null };
const redis = env.redisUrl
  ? new IORedis(env.redisUrl, baseOpts)
  : new IORedis({ host: env.redis.host, port: env.redis.port, ...baseOpts });

const allowedTargets = new Set(['pdf','csv','txt','odt','odp']);

async function getJobInfo(id) {
  const data = await redis.hgetall(`bull:convert:${id}`);
  const state = data.state || data.status || 'unknown';
  let outputUrl = null;
  if ((state === 'completed' || data.outKey) && data.outKey) {
    outputUrl = await signedDownloadUrl(env.s3.bucketOutput, data.outKey);
  }
  return {
    id, status: state,
    progress: data.progress ? Number(data.progress) : null,
    outputUrl,
    error: data.failedReason || data.error || null
  };
}

async function enqueue({ objectKey, targetFormat }) {
  return await convertQueue.add('convert', { objectKey, targetFormat });
}

async function bootstrap() {
  await ensureBucket(env.s3.bucketInput);
  await ensureBucket(env.s3.bucketOutput);

  app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      const targetFormat = (req.body.targetFormat || '').toLowerCase();
      if (!file) return res.status(400).json({ error: 'Arquivo ausente' });
      if (!allowedTargets.has(targetFormat)) return res.status(400).json({ error: 'targetFormat inválido' });

      const key = `${Date.now()}-${file.originalname}`;
      await putObject(env.s3.bucketInput, key, file.buffer, file.mimetype);

      const job = await enqueue({ objectKey: key, targetFormat });
      res.json({ jobId: job.id, objectKey: key });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/status/:id', async (req, res) => {
    const info = await getJobInfo(req.params.id);
    res.json(info);
  });

  const graph = buildGraph({ getJobInfo, enqueue });
  await graph.start();
  graph.applyMiddleware({ app, path: '/graphql' });

  app.listen(env.apiPort, env.apiHost, () =>
    console.log(`API on http://${env.apiHost}:${env.apiPort}`)
  );
}

bootstrap();
