import { asc, eq } from "drizzle-orm";
import type { z } from "zod";
import { db } from "../db/index.js";
import { mediaAssets, processSteps, siteSettings } from "../db/schema.js";
import { AppError } from "../lib/errors.js";
import { mediaInput, processStepInput } from "../validators/content.js";

type ProcessInput = z.infer<typeof processStepInput>;
type MediaInput = z.infer<typeof mediaInput>;

export const contentService = {
  listProcess(activeOnly = true) {
    return db.query.processSteps.findMany({ where: activeOnly ? eq(processSteps.isActive, true) : undefined, orderBy: [asc(processSteps.sortOrder)] });
  },
  async saveProcess(id: string | null, input: ProcessInput) {
    if (!id) return (await db.insert(processSteps).values(input).returning())[0];
    const [row] = await db.update(processSteps).set({ ...input, updatedAt: new Date() }).where(eq(processSteps.id, id)).returning();
    if (!row) throw new AppError(404, "Process step not found");
    return row;
  },
  async removeProcess(id: string) {
    const [row] = await db.delete(processSteps).where(eq(processSteps.id, id)).returning({ id: processSteps.id });
    if (!row) throw new AppError(404, "Process step not found");
  },
  listMedia(galleryOnly = false) {
    return db.query.mediaAssets.findMany({ where: galleryOnly ? eq(mediaAssets.galleryVisible, true) : undefined, orderBy: [asc(mediaAssets.sortOrder)] });
  },
  async saveMedia(id: string | null, input: MediaInput) {
    if (!id) return (await db.insert(mediaAssets).values(input).returning())[0];
    const [row] = await db.update(mediaAssets).set({ ...input, updatedAt: new Date() }).where(eq(mediaAssets.id, id)).returning();
    if (!row) throw new AppError(404, "Media asset not found");
    return row;
  },
  async removeMedia(id: string) {
    const [row] = await db.delete(mediaAssets).where(eq(mediaAssets.id, id)).returning({ id: mediaAssets.id });
    if (!row) throw new AppError(404, "Media asset not found");
  },
  async getSettings() {
    const rows = await db.select().from(siteSettings);
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  },
  async getSetting(key: string) {
    const row = await db.query.siteSettings.findFirst({ where: eq(siteSettings.key, key) });
    if (!row) throw new AppError(404, "Site setting not found");
    return row.value;
  },
  async setSetting(key: string, value: unknown) {
    const [row] = await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } }).returning();
    return row;
  },
};
