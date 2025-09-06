import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env.js";
import { createWriteStream, readFileSync } from "fs";
import { pipeline } from "stream/promises";

export const s3 = new S3Client({
  endpoint: env.s3.endpoint,
  region: env.s3.region,
  credentials: { accessKeyId: env.s3.accessKeyId, secretAccessKey: env.s3.secretAccessKey },
  forcePathStyle: env.s3.forcePathStyle
});

export async function downloadToFile(bucket, key, outPath) {
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  await pipeline(res.Body, createWriteStream(outPath));
}

export async function uploadFromFile(bucket, key, localPath, contentType = 'application/octet-stream') {
  const Body = readFileSync(localPath);
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body, ContentType: contentType }));
}
