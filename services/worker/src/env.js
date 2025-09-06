import 'dotenv/config';
export const env = {
  redisUrl: process.env.REDIS_URL || null,
  redis: { host: process.env.REDIS_HOST || 'redis', port: Number(process.env.REDIS_PORT || 6379) },
  s3: {
    endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
    bucketInput: process.env.S3_BUCKET_INPUT || 'uploads',
    bucketOutput: process.env.S3_BUCKET_OUTPUT || 'outputs',
    forcePathStyle: (process.env.S3_FORCE_PATH_STYLE || 'true') === 'true'
  },
  concurrency: Number(process.env.WORKER_CONCURRENCY || 2)
};
