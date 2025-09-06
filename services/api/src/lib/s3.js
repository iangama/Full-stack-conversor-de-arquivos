import { S3Client, PutObjectCommand, HeadBucketCommand, CreateBucketCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env.js";

export const s3 = new S3Client({
  endpoint: env.s3.endpoint,          // interno: minio:9000
  region: env.s3.region,
  credentials: { accessKeyId: env.s3.accessKeyId, secretAccessKey: env.s3.secretAccessKey },
  forcePathStyle: env.s3.forcePathStyle
});

export async function ensureBucket(name) {
  try { await s3.send(new HeadBucketCommand({ Bucket: name })); }
  catch { await s3.send(new CreateBucketCommand({ Bucket: name })); }
}

export async function putObject(bucket, key, body, contentType) {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
  return key;
}

export async function signedDownloadUrl(bucket, key, expiresSec = 3600) {
  // Cliente separado só para ASSINAR com o host público (localhost:9000)
  const publicEndpoint = process.env.PUBLIC_MINIO_URL || env.s3.endpoint;
  const signerClient = new S3Client({
    endpoint: publicEndpoint,
    region: env.s3.region,
    credentials: { accessKeyId: env.s3.accessKeyId, secretAccessKey: env.s3.secretAccessKey },
    forcePathStyle: env.s3.forcePathStyle
  });
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(signerClient, cmd, { expiresIn: expiresSec });
}
