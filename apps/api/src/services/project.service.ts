import { and, asc, desc, eq } from "drizzle-orm";
import type { z } from "zod";
import { db } from "../db/index.js";
import { projectContributors, projectMockups, projects, projectTags, projectTimelineItems } from "../db/schema.js";
import { AppError } from "../lib/errors.js";
import { projectInput } from "../validators/content.js";

type ProjectInput = z.infer<typeof projectInput>;

const projectWith = {
  tags: { orderBy: [asc(projectTags.sortOrder)] },
  timeline: { orderBy: [asc(projectTimelineItems.sortOrder)] },
  mockups: { orderBy: [asc(projectMockups.sortOrder)] },
  contributors: {
    orderBy: [asc(projectContributors.sortOrder)],
    with: { teamMember: true as const },
  },
};

const contributorValues = (projectId: string, contributors: ProjectInput["contributors"]) => contributors.map((item, sortOrder) => ({
  projectId,
  teamMemberId: "teamMemberId" in item ? item.teamMemberId : null,
  externalName: "externalName" in item ? item.externalName : null,
  linkedinUrl: "externalName" in item ? item.linkedinUrl ?? null : null,
  instagramUrl: "externalName" in item ? item.instagramUrl ?? null : null,
  role: item.role,
  sortOrder,
}));

const present = (project: NonNullable<Awaited<ReturnType<typeof findProject>>>) => ({
  ...project,
  tags: project.tags.map((item) => item.tag),
  contributors: project.contributors.map((item) => item.teamMember
    ? { ...item.teamMember, contributionRole: item.role, contributorType: "team" }
    : { id: item.id, name: item.externalName, shortName: item.externalName, contributionRole: item.role, role: item.role, linkedinUrl: item.linkedinUrl, instagramUrl: item.instagramUrl, contributorType: "external", isExternal: true }),
});

function findProject(slug: string, publishedOnly: boolean) {
  return db.query.projects.findFirst({
    where: publishedOnly ? and(eq(projects.slug, slug), eq(projects.status, "published")) : eq(projects.slug, slug),
    with: projectWith,
  });
}

export const projectService = {
  async list(publishedOnly = true) {
    const rows = await db.query.projects.findMany({
      where: publishedOnly ? eq(projects.status, "published") : undefined,
      orderBy: [asc(projects.sortOrder), desc(projects.year)],
      with: projectWith,
    });
    return rows.map(present);
  },

  async getBySlug(slug: string, publishedOnly = true) {
    const row = await findProject(slug, publishedOnly);
    if (!row) throw new AppError(404, "Project not found");
    return present(row);
  },

  async create(input: ProjectInput) {
    await db.transaction(async (tx) => {
      const [project] = await tx.insert(projects).values({
        ...input,
        publishedAt: input.status === "published" ? new Date() : null,
      }).returning({ id: projects.id });
      if (!project) throw new AppError(500, "Project could not be created");
      await insertChildren(tx, project.id, input);
    });
    return this.getBySlug(input.slug, false);
  },

  async update(id: string, input: ProjectInput) {
    await db.transaction(async (tx) => {
      const [updated] = await tx.update(projects).set({
        ...input,
        publishedAt: input.status === "published" ? new Date() : null,
        updatedAt: new Date(),
      }).where(eq(projects.id, id)).returning({ id: projects.id });
      if (!updated) throw new AppError(404, "Project not found");
      await Promise.all([
        tx.delete(projectTags).where(eq(projectTags.projectId, id)),
        tx.delete(projectTimelineItems).where(eq(projectTimelineItems.projectId, id)),
        tx.delete(projectMockups).where(eq(projectMockups.projectId, id)),
        tx.delete(projectContributors).where(eq(projectContributors.projectId, id)),
      ]);
      await insertChildren(tx, id, input);
    });
    return this.getBySlug(input.slug, false);
  },

  async remove(id: string) {
    const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id });
    if (!deleted) throw new AppError(404, "Project not found");
  },
};

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function insertChildren(tx: Transaction, projectId: string, input: ProjectInput) {
  if (input.tags.length) await tx.insert(projectTags).values(input.tags.map((tag, sortOrder) => ({ projectId, tag, sortOrder })));
  if (input.timeline.length) await tx.insert(projectTimelineItems).values(input.timeline.map((item, sortOrder) => ({ projectId, ...item, sortOrder })));
  if (input.mockups.length) await tx.insert(projectMockups).values(input.mockups.map((item, sortOrder) => ({ projectId, ...item, sortOrder })));
  if (input.contributors.length) await tx.insert(projectContributors).values(contributorValues(projectId, input.contributors));
}
