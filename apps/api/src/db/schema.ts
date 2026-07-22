import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const userRole = pgEnum("user_role", ["editor", "admin"]);
export const contentStatus = pgEnum("content_status", ["draft", "published", "archived"]);
export const mediaKind = pgEnum("media_kind", ["image", "document", "video"]);

// Better Auth core tables. Keep property names aligned with its Drizzle adapter.
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: userRole("role").default("editor").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (table) => [index("session_user_id_idx").on(table.userId)]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("account_user_id_idx").on(table.userId)]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("verification_identifier_idx").on(table.identifier)]);

export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  linkedinUrl: text("linkedin_url"),
  instagramUrl: text("instagram_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("team_members_slug_uidx").on(table.slug)]);

export const teamMemberImages = pgTable("team_member_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamMemberId: uuid("team_member_id").notNull().references(() => teamMembers.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  ...timestamps,
}, (table) => [index("team_member_images_member_idx").on(table.teamMemberId)]);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  description: text("description").notNull(),
  externalUrl: text("external_url"),
  coverImageUrl: text("cover_image_url").notNull(),
  landscapeImageUrl: text("landscape_image_url"),
  type: text("type").notNull(),
  organizer: text("organizer").notNull(),
  competition: text("competition").notNull(),
  problem: text("problem").notNull(),
  solution: text("solution").notNull(),
  status: contentStatus("status").default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  uniqueIndex("projects_slug_uidx").on(table.slug),
  index("projects_status_order_idx").on(table.status, table.sortOrder),
]);

export const projectTags = pgTable("project_tags", {
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [primaryKey({ columns: [table.projectId, table.tag] })]);

export const projectTimelineItems = pgTable("project_timeline_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  phase: text("phase").notNull(),
  duration: text("duration").notNull(),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [index("project_timeline_project_idx").on(table.projectId)]);

export const projectMockups = pgTable("project_mockups", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [index("project_mockups_project_idx").on(table.projectId)]);

export const projectContributors = pgTable("project_contributors", {
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  teamMemberId: uuid("team_member_id").notNull().references(() => teamMembers.id, { onDelete: "restrict" }),
  role: text("role").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [primaryKey({ columns: [table.projectId, table.teamMemberId] })]);

export const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  dateLabel: text("date_label").notNull(),
  competitionName: text("competition_name").notNull(),
  organizer: text("organizer").notNull(),
  scale: text("scale").notNull(),
  placement: text("placement").notNull(),
  projectName: text("project_name").notNull(),
  note: text("note").notNull(),
  story: text("story").notNull(),
  status: contentStatus("status").default("draft").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  ...timestamps,
}, (table) => [index("achievements_status_order_idx").on(table.status, table.sortOrder)]);

export const achievementContributors = pgTable("achievement_contributors", {
  id: uuid("id").defaultRandom().primaryKey(),
  achievementId: text("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  teamMemberId: uuid("team_member_id").references(() => teamMembers.id, { onDelete: "restrict" }),
  externalName: text("external_name"),
  role: text("role").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [
  index("achievement_contributors_achievement_idx").on(table.achievementId),
  check("achievement_contributors_source_check", sql`(("team_member_id" is not null)::int + ("external_name" is not null)::int) = 1`),
]);

export const competitionDocumentation = pgTable("competition_documentation", {
  id: uuid("id").defaultRandom().primaryKey(),
  achievementId: text("achievement_id").notNull().unique().references(() => achievements.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  prototypeUrl: text("prototype_url"),
  proposalUrl: text("proposal_url"),
  summary: text("summary").notNull(),
  background: text("background").notNull(),
  solution: text("solution").notNull(),
  positioning: text("positioning").notNull(),
  ...timestamps,
});

export const documentationSections = pgTable("documentation_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentationId: uuid("documentation_id").notNull().references(() => competitionDocumentation.id, { onDelete: "cascade" }),
  section: text("section").notNull(),
  item: text("item").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [index("documentation_sections_doc_idx").on(table.documentationId)]);

export const processSteps = pgTable("process_steps", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  ...timestamps,
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: mediaKind("kind").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  title: text("title"),
  mimeType: text("mime_type"),
  width: integer("width"),
  height: integer("height"),
  galleryVisible: boolean("gallery_visible").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`).notNull(),
  ...timestamps,
}, (table) => [index("media_gallery_order_idx").on(table.galleryVisible, table.sortOrder)]);

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({ sessions: many(session), accounts: many(account) }));
export const sessionRelations = relations(session, ({ one }) => ({ user: one(user, { fields: [session.userId], references: [user.id] }) }));
export const accountRelations = relations(account, ({ one }) => ({ user: one(user, { fields: [account.userId], references: [user.id] }) }));
export const teamMemberRelations = relations(teamMembers, ({ many }) => ({
  images: many(teamMemberImages),
  projects: many(projectContributors),
  achievements: many(achievementContributors),
}));
export const teamMemberImageRelations = relations(teamMemberImages, ({ one }) => ({ teamMember: one(teamMembers, { fields: [teamMemberImages.teamMemberId], references: [teamMembers.id] }) }));
export const projectRelations = relations(projects, ({ many }) => ({ tags: many(projectTags), timeline: many(projectTimelineItems), mockups: many(projectMockups), contributors: many(projectContributors) }));
export const projectTagRelations = relations(projectTags, ({ one }) => ({ project: one(projects, { fields: [projectTags.projectId], references: [projects.id] }) }));
export const projectTimelineRelations = relations(projectTimelineItems, ({ one }) => ({ project: one(projects, { fields: [projectTimelineItems.projectId], references: [projects.id] }) }));
export const projectMockupRelations = relations(projectMockups, ({ one }) => ({ project: one(projects, { fields: [projectMockups.projectId], references: [projects.id] }) }));
export const projectContributorRelations = relations(projectContributors, ({ one }) => ({
  project: one(projects, { fields: [projectContributors.projectId], references: [projects.id] }),
  teamMember: one(teamMembers, { fields: [projectContributors.teamMemberId], references: [teamMembers.id] }),
}));
export const achievementRelations = relations(achievements, ({ many, one }) => ({ contributors: many(achievementContributors), documentation: one(competitionDocumentation) }));
export const achievementContributorRelations = relations(achievementContributors, ({ one }) => ({
  achievement: one(achievements, { fields: [achievementContributors.achievementId], references: [achievements.id] }),
  teamMember: one(teamMembers, { fields: [achievementContributors.teamMemberId], references: [teamMembers.id] }),
}));
export const documentationRelations = relations(competitionDocumentation, ({ one, many }) => ({
  achievement: one(achievements, { fields: [competitionDocumentation.achievementId], references: [achievements.id] }),
  sections: many(documentationSections),
}));
export const documentationSectionRelations = relations(documentationSections, ({ one }) => ({ documentation: one(competitionDocumentation, { fields: [documentationSections.documentationId], references: [competitionDocumentation.id] }) }));
