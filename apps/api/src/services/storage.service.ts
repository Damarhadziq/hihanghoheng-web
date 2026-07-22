import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";

const MAX_PDF_SIZE = 4 * 1024 * 1024;

const safeFileName = (value: string) => {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned.endsWith(".pdf") ? cleaned : `${cleaned || "proposal"}.pdf`;
};

export async function uploadProposal(file: Buffer, originalName: string) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError(503, "Supabase Storage belum dikonfigurasi.");
  }
  if (!Buffer.isBuffer(file) || file.length === 0) throw new AppError(400, "File PDF wajib dipilih.");
  if (file.length > MAX_PDF_SIZE) throw new AppError(413, "Ukuran PDF maksimal 4 MB.");

  const bucket = env.SUPABASE_STORAGE_BUCKET;
  const objectPath = `proposals/${new Date().toISOString().slice(0, 10)}-${randomUUID()}-${safeFileName(originalName)}`;
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  const storageUrl = env.SUPABASE_URL.replace(/\/$/, "");
  const response = await fetch(`${storageUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/pdf",
      "x-upsert": "false",
    },
    body: new Uint8Array(file),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase Storage upload failed", response.status, detail);
    throw new AppError(502, "Proposal gagal diunggah ke Supabase Storage.");
  }

  return {
    url: `${storageUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`,
    path: objectPath,
    fileName: safeFileName(originalName),
    size: file.length,
    mimeType: "application/pdf",
  };
}
