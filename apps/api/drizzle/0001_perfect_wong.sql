ALTER TABLE "achievement_contributors" DROP CONSTRAINT "achievement_contributors_achievement_id_team_member_id_pk";--> statement-breakpoint
ALTER TABLE "achievement_contributors" ALTER COLUMN "team_member_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "achievement_contributors" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "achievement_contributors" ADD COLUMN "external_name" text;--> statement-breakpoint
CREATE INDEX "achievement_contributors_achievement_idx" ON "achievement_contributors" USING btree ("achievement_id");--> statement-breakpoint
ALTER TABLE "achievement_contributors" ADD CONSTRAINT "achievement_contributors_source_check" CHECK ((("team_member_id" is not null)::int + ("external_name" is not null)::int) = 1);