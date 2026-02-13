import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { GetObjectCommand, NoSuchKey, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const dataDirectory = path.join(process.cwd(), 'data');
const dataPrefix = process.env.APP_DATA_PREFIX || 'dj-ana-jones';

type BodyWithTransform = {
  transformToString: () => Promise<string>;
};

const isBodyWithTransform = (value: unknown): value is BodyWithTransform => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'transformToString' in value &&
    typeof (value as { transformToString?: unknown }).transformToString === 'function'
  );
};

const getS3Config = () => {
  const region = process.env.DJ_AWS_REGION || process.env.AWS_REGION;
  const accessKeyId =
    process.env.DJ_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.DJ_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const bucket = process.env.DJ_AWS_S3_BUCKET || process.env.AWS_S3_BUCKET;

  if (!region || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  return {
    region,
    bucket,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  };
};

const getS3Client = () => {
  const config = getS3Config();

  if (!config) {
    return null;
  }

  return new S3Client({
    region: config.region,
    credentials: config.credentials,
  });
};

const ensureLocalFile = async (filePath: string) => {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(filePath, 'utf8');
  } catch {
    await writeFile(filePath, '[]', 'utf8');
  }
};

const ensureLocalFileWithContent = async (filePath: string, content: string) => {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(filePath, 'utf8');
  } catch {
    await writeFile(filePath, content, 'utf8');
  }
};

const readLocalCollection = async <T>(fileName: string): Promise<T[]> => {
  const filePath = path.join(dataDirectory, fileName);
  await ensureLocalFile(filePath);

  try {
    const content = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const writeLocalCollection = async <T>(fileName: string, data: T[]) => {
  const filePath = path.join(dataDirectory, fileName);
  await ensureLocalFile(filePath);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const readLocalJson = async <T>(fileName: string, fallback: T): Promise<T> => {
  const filePath = path.join(dataDirectory, fileName);
  await ensureLocalFileWithContent(filePath, JSON.stringify(fallback, null, 2));

  try {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
};

const writeLocalJson = async <T>(fileName: string, data: T) => {
  const filePath = path.join(dataDirectory, fileName);
  await ensureLocalFileWithContent(filePath, JSON.stringify(data, null, 2));
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const getObjectKey = (fileName: string) => `${dataPrefix}/${fileName}`;

const readS3Collection = async <T>(fileName: string): Promise<T[] | null> => {
  const config = getS3Config();
  const client = getS3Client();

  if (!config || !client) {
    return null;
  }

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: config.bucket,
        Key: getObjectKey(fileName),
      }),
    );

    if (!isBodyWithTransform(response.Body)) {
      return [];
    }

    const body = await response.Body.transformToString();
    const parsed = JSON.parse(body);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if (error instanceof NoSuchKey) {
      return [];
    }

    return null;
  }
};

const writeS3Collection = async <T>(fileName: string, data: T[]): Promise<boolean> => {
  const config = getS3Config();
  const client = getS3Client();

  if (!config || !client) {
    return false;
  }

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: getObjectKey(fileName),
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json; charset=utf-8',
      }),
    );

    return true;
  } catch {
    return false;
  }
};

const readS3Json = async <T>(
  fileName: string,
): Promise<T | undefined | null> => {
  const config = getS3Config();
  const client = getS3Client();

  if (!config || !client) {
    return null;
  }

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: config.bucket,
        Key: getObjectKey(fileName),
      }),
    );

    if (!isBodyWithTransform(response.Body)) {
      return undefined;
    }

    const body = await response.Body.transformToString();
    return JSON.parse(body) as T;
  } catch (error) {
    if (error instanceof NoSuchKey) {
      return undefined;
    }

    return null;
  }
};

const writeS3Json = async <T>(fileName: string, data: T): Promise<boolean> => {
  const config = getS3Config();
  const client = getS3Client();

  if (!config || !client) {
    return false;
  }

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: getObjectKey(fileName),
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json; charset=utf-8',
      }),
    );

    return true;
  } catch {
    return false;
  }
};

export const readCollection = async <T>(fileName: string): Promise<T[]> => {
  const s3Data = await readS3Collection<T>(fileName);

  if (s3Data !== null) {
    return s3Data;
  }

  return readLocalCollection<T>(fileName);
};

export const writeCollection = async <T>(fileName: string, data: T[]) => {
  const savedToS3 = await writeS3Collection<T>(fileName, data);

  if (savedToS3) {
    return;
  }

  await writeLocalCollection(fileName, data);
};

export const readJson = async <T>(fileName: string, fallback: T): Promise<T> => {
  const s3Data = await readS3Json<T>(fileName);

  if (s3Data === null) {
    return readLocalJson(fileName, fallback);
  }

  if (s3Data === undefined) {
    return fallback;
  }

  return s3Data;
};

export const writeJson = async <T>(fileName: string, data: T) => {
  const savedToS3 = await writeS3Json(fileName, data);

  if (savedToS3) {
    return;
  }

  await writeLocalJson(fileName, data);
};
