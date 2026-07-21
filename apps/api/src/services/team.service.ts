import { asc, eq } from "drizzle-orm";
import type { z } from "zod";
import { db } from "../db/index.js";
import { teamMemberImages, teamMembers } from "../db/schema.js";
import { AppError } from "../lib/errors.js";
import { teamMemberInput } from "../validators/content.js";

type TeamMemberInput = z.infer<typeof teamMemberInput>;

export const teamService = {
  list(activeOnly = true) {
    return db.query.teamMembers.findMany({
      where: activeOnly ? eq(teamMembers.isActive, true) : undefined,
      orderBy: [asc(teamMembers.sortOrder)],
      with: { images: { orderBy: [asc(teamMemberImages.sortOrder)] } },
    });
  },
  async create(input: TeamMemberInput) {
    const id = await db.transaction(async (tx) => {
      const [row] = await tx.insert(teamMembers).values(input).returning({ id: teamMembers.id });
      if (!row) throw new AppError(500, "Team member could not be created");
      if (input.images.length) await tx.insert(teamMemberImages).values(input.images.map((image, sortOrder) => ({ teamMemberId: row.id, ...image, sortOrder })));
      return row.id;
    });
    return db.query.teamMembers.findFirst({ where: eq(teamMembers.id, id), with: { images: true } });
  },
  async update(id: string, input: TeamMemberInput) {
    await db.transaction(async (tx) => {
      const [row] = await tx.update(teamMembers).set({ ...input, updatedAt: new Date() }).where(eq(teamMembers.id, id)).returning({ id: teamMembers.id });
      if (!row) throw new AppError(404, "Team member not found");
      await tx.delete(teamMemberImages).where(eq(teamMemberImages.teamMemberId, id));
      if (input.images.length) await tx.insert(teamMemberImages).values(input.images.map((image, sortOrder) => ({ teamMemberId: id, ...image, sortOrder })));
    });
    return db.query.teamMembers.findFirst({ where: eq(teamMembers.id, id), with: { images: true } });
  },
  async remove(id: string) {
    const [row] = await db.delete(teamMembers).where(eq(teamMembers.id, id)).returning({ id: teamMembers.id });
    if (!row) throw new AppError(404, "Team member not found");
  },
};
