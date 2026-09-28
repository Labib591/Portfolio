import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomBytes } from "node:crypto";
import { imageSize } from "image-size";
import "server-only";

/**
 * Art uploads, on Neon's branchable object storage.
 *
 * Same provider as the database on purpose: one account, one bill, one thing to
 * keep alive, and the bucket branches with the project exactly like the tables
 * do. `forcePathStyle` is required — Neon addresses buckets as a path, not as a
 * subdomain, and the SDK defaults the other way.
 */

const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.S3_BUCKET;

export const storageReady = Boolean(
  endpoint && bucket && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
);

const client = storageReady
  ? new S3Client({
      region: process.env.S3_REGION ?? "us-east-1",
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })
  : null;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export const ALLOWED = Object.keys(EXT);
export const MAX_BYTES = 12 * 1024 * 1024;

export async function uploadImage(file: File) {
  if (!client || !bucket) throw new Error("object storage is not configured");
  if (!ALLOWED.includes(file.type)) {
    throw new Error(`${file.type || "that file"} is not an image i can take`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`that file is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 12MB`);
  }

  // Random key, not the original filename: filenames collide, leak local paths,
  // and arrive with characters that need escaping in a URL.
  const key = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${EXT[file.type]}`;
  const body = Buffer.from(await file.arrayBuffer());

  // Read the real dimensions from the header bytes. Artwork must render at its
  // own aspect ratio — cropping photo-manipulation pieces into a uniform grid
  // destroys the composition, and without width/height the layout also shifts
  // as each image loads.
  let width: number | null = null;
  let height: number | null = null;
  try {
    const size = imageSize(body);
    width = size.width ?? null;
    height = size.height ?? null;
  } catch {
    // A format image-size cannot parse still uploads; the grid falls back to a
    // default ratio for that one piece rather than rejecting the file.
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type,
      // Bucket is public-read; a year is safe because the key is content-unique.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return { url: `${endpoint}/${bucket}/${key}`, key, width, height };
}

/** Is this already one of ours? */
export const isStored = (url: string) => Boolean(endpoint && url.startsWith(endpoint));

/**
 * Pull a pasted image URL into our own bucket.
 *
 * The alternative is listing every host Mahir might paste from in
 * `remotePatterns`, and the only way to make that reliable is a `**` wildcard,
 * which turns the Next image optimizer into an open proxy anyone can point at
 * arbitrary files. Copying the bytes once at save time avoids that entirely,
 * stops hotlinking someone else's bandwidth, and means a poster still renders
 * after the source takes it down.
 *
 * Returns the original URL unchanged if it cannot be fetched — a poster that
 * fails to copy is not a reason to lose the edit.
 */
export async function ingestImageUrl(url: string): Promise<string> {
  if (!storageReady || isStored(url)) return url;
  if (!/^https:\/\//i.test(url)) return url;

  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
      headers: { accept: "image/*" },
    });
    if (!res.ok) return url;

    const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    if (!ALLOWED.includes(type)) return url;

    const length = Number(res.headers.get("content-length") ?? 0);
    if (length > MAX_BYTES) return url;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > MAX_BYTES) return url;

    const { url: stored } = await uploadImage(
      new File([new Uint8Array(buf)], "remote", { type }),
    );
    return stored;
  } catch {
    return url;
  }
}

export async function deleteImage(url: string) {
  if (!client || !bucket) return;
  const key = url.split("/").pop();
  if (!key) return;
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
