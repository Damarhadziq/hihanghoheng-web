import { asc, desc, eq } from "drizzle-orm";
import type { z } from "zod";
import { db } from "../db/index.js";
import { achievementContributors, achievements, competitionDocumentation, documentationSections } from "../db/schema.js";
import { AppError } from "../lib/errors.js";
import { achievementInput, documentationInput } from "../validators/content.js";

type AchievementInput = z.infer<typeof achievementInput>;
type DocumentationInput = z.infer<typeof documentationInput>;

const withRelations = {
  contributors: { orderBy: [asc(achievementContributors.sortOrder)], with: { teamMember: true as const } },
  documentation: { with: { sections: { orderBy: [asc(documentationSections.sortOrder)] } } },
};

function present<T extends { contributors: Array<{ role: string; teamMember: unknown }>; documentation: null | { sections: Array<{ section: string; item: string }> } }>(row: T) {
  return {
    ...row,
    contributors: row.contributors.map((item) => ({ ...(item.teamMember as object), contributionRole: item.role })),
    documentation: row.documentation ? {
      ...row.documentation,
      sections: row.documentation.sections.reduce<Record<string, string[]>>((groups, item) => {
        (groups[item.section] ??= []).push(item.item);
        return groups;
      }, {}),
    } : null,
  };
}

export const achievementService = {
  async list(publishedOnly = true) {
    const rows = await db.query.achievements.findMany({
      where: publishedOnly ? eq(achievements.status, "published") : undefined,
      orderBy: [asc(achievements.sortOrder), desc(achievements.occurredAt)],
      with: withRelations,
    });
    return rows.map(present);
  },
  async get(id: string, publishedOnly = true) {
    const row = await db.query.achievements.findFirst({
      where: publishedOnly ? (table, { and }) => and(eq(table.id, id), eq(table.status, "published")) : eq(achievements.id, id),
      with: withRelations,
    });
    if (!row) throw new AppError(404, "Achievement not found");
    return present(row);
  },
  async create(input: AchievementInput) {
    await db.transaction(async (tx) => {
      await tx.insert(achievements).values(input);
      if (input.contributors.length) await tx.insert(achievementContributors).values(input.contributors.map((item, sortOrder) => ({ achievementId: input.id, ...item, sortOrder })));
    });
    return this.get(input.id, false);
  },
  async update(id: string, input: AchievementInput) {
    await db.transaction(async (tx) => {
      const [row] = await tx.update(achievements).set({ ...input, id, updatedAt: new Date() }).where(eq(achievements.id, id)).returning({ id: achievements.id });
      if (!row) throw new AppError(404, "Achievement not found");
      await tx.delete(achievementContributors).where(eq(achievementContributors.achievementId, id));
      if (input.contributors.length) await tx.insert(achievementContributors).values(input.contributors.map((item, sortOrder) => ({ achievementId: id, ...item, sortOrder })));
    });
    return this.get(id, false);
  },
  async upsertDocumentation(achievementId: string, input: DocumentationInput) {
    await this.get(achievementId, false);
    await db.transaction(async (tx) => {
      const [doc] = await tx.insert(competitionDocumentation).values({ achievementId, ...input }).onConflictDoUpdate({
        target: competitionDocumentation.achievementId,
        set: { ...input, updatedAt: new Date() },
      }).returning({ id: competitionDocumentation.id });
      if (!doc) throw new AppError(500, "Documentation could not be saved");
      await tx.delete(documentationSections).where(eq(documentationSections.documentationId, doc.id));
      const values = Object.entries(input.sections).flatMap(([section, items]) => items.map((item, sortOrder) => ({ documentationId: doc.id, section, item, sortOrder })));
      if (values.length) await tx.insert(documentationSections).values(values);
    });
    return this.get(achievementId, false);
  },
  async remove(id: string) {
    const [row] = await db.delete(achievements).where(eq(achievements.id, id)).returning({ id: achievements.id });
    if (!row) throw new AppError(404, "Achievement not found");
  },
};
