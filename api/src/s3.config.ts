import { S3Client } from '@aws-sdk/client-s3';

export function createS3Client(): S3Client {
  const region = process.env.AWS_REGION || 'us-east-1';
  const endpoint = process.env.S3_ENDPOINT || 'http://localhost:4566';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing AWS credentials: AWS_ACCESS_KEY_ID and/or AWS_SECRET_ACCESS_KEY',
    );
  }

  const client = new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  return client;
}
