ALTER TABLE "project_contributors" DROP CONSTRAINT "project_contributors_project_id_team_member_id_pk";--> statement-breakpoint
ALTER TABLE "project_contributors" ALTER COLUMN "team_member_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "achievement_contributors" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "achievement_contributors" ADD COLUMN "instagram_url" text;--> statement-breakpoint
ALTER TABLE "project_contributors" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "project_contributors" ADD COLUMN "external_name" text;--> statement-breakpoint
ALTER TABLE "project_contributors" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "project_contributors" ADD COLUMN "instagram_url" text;--> statement-breakpoint
CREATE INDEX "project_contributors_project_idx" ON "project_contributors" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "project_contributors" ADD CONSTRAINT "project_contributors_source_check" CHECK ((("team_member_id" is not null)::int + ("external_name" is not null)::int) = 1);