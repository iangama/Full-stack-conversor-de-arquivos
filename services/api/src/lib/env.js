import 'dotenv/config';

export const env = {
  apiPort: Number(process.env.PORT || process.env.API_PORT || 4000),
  apiHost: process.env.API_HOST || '0.0.0.0',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 50),
  redisUrl: process.env.REDIS_URL || null,
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT || 6379),
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
    bucketInput: process.env.S3_BUCKET_INPUT || 'uploads',
    bucketOutput: process.env.S3_BUCKET_OUTPUT || 'outputs',
    forcePathStyle: (process.env.S3_FORCE_PATH_STYLE || 'true') === 'true'
  }
};
