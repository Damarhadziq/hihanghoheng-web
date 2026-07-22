import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";

const MAX_PDF_SIZE = 4 * 1024 * 1024;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const imageTypes = {
  jpeg: { mimeType: "image/jpeg", extension: "jpg" },
  png: { mimeType: "image/png", extension: "png" },
  webp: { mimeType: "image/webp", extension: "webp" },
} as const;

const safeBaseName = (value: string, fallback: string) => {
  const withoutExtension = value.replace(/\.[^.]+$/, "");
  return withoutExtension.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || fallback;
};

const safePdfName = (value: string) => {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned.endsWith(".pdf") ? cleaned : `${cleaned || "proposal"}.pdf`;
};

const safeScope = (value: string) => {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "general";
};

const storageConfig = () => {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError(503, "Supabase Storage belum dikonfigurasi.");
  }

  return {
    bucket: env.SUPABASE_STORAGE_BUCKET,
    storageUrl: env.SUPABASE_URL.replace(/\/$/, ""),
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
};

async function uploadObject(file: Buffer, objectPath: string, mimeType: string) {
  const { bucket, storageUrl, serviceRoleKey } = storageConfig();
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(`${storageUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": mimeType,
      "x-upsert": "false",
    },
    body: new Uint8Array(file),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase Storage upload failed", response.status, detail);
    throw new AppError(502, "File gagal diunggah ke Supabase Storage.");
  }

  return {
    url: `${storageUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`,
    path: objectPath,
    size: file.length,
    mimeType,
  };
}

const detectImageType = (file: Buffer) => {
  if (file.length >= 8 && file.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return imageTypes.png;
  if (file.length >= 3 && file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff) return imageTypes.jpeg;
  if (file.length >= 12 && file.toString("ascii", 0, 4) === "RIFF" && file.toString("ascii", 8, 12) === "WEBP") return imageTypes.webp;
  return null;
};

export async function uploadProposal(file: Buffer, originalName: string) {
  if (!Buffer.isBuffer(file) || file.length === 0) throw new AppError(400, "File PDF wajib dipilih.");
  if (file.length > MAX_PDF_SIZE) throw new AppError(413, "Ukuran PDF maksimal 4 MB.");

  const fileName = safePdfName(originalName);
  const objectPath = `proposals/${new Date().toISOString().slice(0, 10)}-${randomUUID()}-${fileName}`;
  return { ...await uploadObject(file, objectPath, "application/pdf"), fileName };
}

export async function uploadImage(file: Buffer, originalName: string, scope: string) {
  if (!Buffer.isBuffer(file) || file.length === 0) throw new AppError(400, "File gambar wajib dipilih.");
  if (file.length > MAX_IMAGE_SIZE) throw new AppError(413, "Ukuran gambar maksimal 4 MB.");

  const imageType = detectImageType(file);
  if (!imageType) throw new AppError(415, "Gambar harus berformat JPG, PNG, atau WebP.");

  const fileName = `${safeBaseName(originalName, "image")}.${imageType.extension}`;
  const objectPath = `images/${safeScope(scope)}/${new Date().toISOString().slice(0, 10)}-${randomUUID()}-${fileName}`;
  return { ...await uploadObject(file, objectPath, imageType.mimeType), fileName };
}
