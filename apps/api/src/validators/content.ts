import { z } from "zod";

const timelineItem = z.object({ phase: z.string().min(1), duration: z.string().min(1), title: z.string().min(1), detail: z.string().min(1) });
const mockup = z.object({ title: z.string().min(1), imageUrl: z.string().min(1), altText: z.string().min(1) });

const externalSocialLinks = {
  linkedinUrl: z.string().trim().url().nullable().optional(),
  instagramUrl: z.string().trim().url().nullable().optional(),
};

const contributorInput = z.union([
  z.object({ type: z.literal("team").optional(), teamMemberId: z.uuid(), role: z.string().min(1) }),
  z.object({ type: z.literal("external"), externalName: z.string().trim().min(1), role: z.string().min(1), ...externalSocialLinks }),
]);
export const projectInput = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1), year: z.number().int().min(2000).max(2100), description: z.string().min(1),
  externalUrl: z.string().nullable().optional(), coverImageUrl: z.string().min(1), landscapeImageUrl: z.string().nullable().optional(),
  type: z.string().min(1), organizer: z.string().min(1), competition: z.string().min(1), problem: z.string().min(1), solution: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]).default("draft"), featured: z.boolean().default(false), sortOrder: z.number().int().default(0),
  tags: z.array(z.string().min(1)).default([]), timeline: z.array(timelineItem).default([]), mockups: z.array(mockup).default([]),
  contributors: z.array(contributorInput).default([]),
});

export const teamMemberInput = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().min(1), shortName: z.string().min(1), role: z.string().min(1),
  bio: z.string().nullable().optional(), linkedinUrl: z.string().nullable().optional(), instagramUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0), isActive: z.boolean().default(true),
  images: z.array(z.object({ url: z.string().min(1), altText: z.string().min(1) })).default([]),
});


export const achievementInput = z.object({
  id: z.string().min(1), occurredAt: z.coerce.date(), dateLabel: z.string().min(1), competitionName: z.string().min(1), organizer: z.string().min(1),
  scale: z.string().min(1), placement: z.string().min(1), projectName: z.string().min(1), note: z.string().min(1), story: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]).default("draft"), sortOrder: z.number().int().default(0),
  contributors: z.array(contributorInput).default([]),
});

export const documentationInput = z.object({
  category: z.string().min(1), prototypeUrl: z.string().nullable().optional(), proposalUrl: z.string().nullable().optional(), summary: z.string().min(1),
  background: z.string().min(1), solution: z.string().min(1), positioning: z.string().min(1),
  sections: z.record(z.string(), z.array(z.string().min(1))).default({}),
});

export const processStepInput = z.object({ label: z.string().min(1), title: z.string().min(1), description: z.string().min(1), sortOrder: z.number().int().default(0), isActive: z.boolean().default(true) });
export const mediaInput = z.object({ kind: z.enum(["image", "document", "video"]), url: z.string().min(1), altText: z.string().nullable().optional(), title: z.string().nullable().optional(), mimeType: z.string().nullable().optional(), width: z.number().int().positive().nullable().optional(), height: z.number().int().positive().nullable().optional(), galleryVisible: z.boolean().default(false), sortOrder: z.number().int().default(0), metadata: z.record(z.string(), z.unknown()).default({}) });
export const siteSettingInput = z.object({ value: z.unknown() });
