import { asc, eq } from "drizzle-orm";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { pool, db } from "./index.js";
import { mediaAssets, processSteps, projects, teamMembers } from "./schema.js";
import { achievementService } from "../services/achievement.service.js";
import { contentService } from "../services/content.service.js";
import { projectService } from "../services/project.service.js";
import { teamService } from "../services/team.service.js";

type FrontendTeamMember = { name: string; shortName: string; role: string; images: string[]; social: { linkedin?: string; instagram?: string } };
type FrontendProject = { name: string; year: string; tags: string[]; description: string; link?: string; image: string; mockup16x9?: string; type: string; organizer: string; competition: string; problem: string; solution: string; team: Array<{ name: string; role: string }>; timeline: Array<{ phase: string; duration: string; title: string; detail: string }>; mockups: Array<{ title: string; image: string }> };
type FrontendAchievement = { id: string; date: string; competitionName: string; organizer: string; scale: string; placement: string; projectName: string; note: string; story: string; contributors: Array<{ name: string; role: string }> };
type FrontendDocumentation = { category: string; prototypeUrl: string | null; summary: string; background: string; solution: string; positioning: string; objectives: string[]; users: string[]; innovations: string[]; features: string[]; limitations: string[]; userFlow: string[] };

const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function loadFrontendData() {
  const frontendRoot = resolve(process.cwd(), "../..");
  const load = (file: string) => import(pathToFileURL(resolve(frontendRoot, "src/data", file)).href);
  const [teamModule, projectModule, processModule, achievementModule, documentationModule] = await Promise.all([load("team.js"), load("projects.js"), load("process.js"), load("achievements.js"), load("documentation.js")]);
  return {
    team: teamModule.team as FrontendTeamMember[], projects: projectModule.projects as FrontendProject[],
    process: processModule.process as Array<{ label: string; title: string; description: string }>,
    achievements: achievementModule.achievements as FrontendAchievement[],
    documentation: documentationModule.competitionDocumentation as Record<string, FrontendDocumentation>,
    proposalUrl: documentationModule.proposalReferenceUrl as string,
  };
}

async function seed() {
  const source = await loadFrontendData();
  for (const [sortOrder, member] of source.team.entries()) {
    const input = { slug: slugify(member.shortName), name: member.name, shortName: member.shortName, role: member.role, linkedinUrl: member.social.linkedin ?? null, instagramUrl: member.social.instagram ?? null, sortOrder, isActive: true, images: member.images.map((url, index) => ({ url, altText: `${member.name} portrait ${index + 1}` })) };
    const existing = await db.query.teamMembers.findFirst({ where: eq(teamMembers.slug, input.slug) });
    if (existing) await teamService.update(existing.id, input); else await teamService.create(input);
  }

  const members = await db.query.teamMembers.findMany();
  const memberIdByName = new Map(members.map((member) => [member.name, member.id]));
  const contributors = (people: Array<{ name: string; role: string }>) => people.map((person) => ({ teamMemberId: memberIdByName.get(person.name), role: person.role })).filter((person): person is { teamMemberId: string; role: string } => Boolean(person.teamMemberId));

  for (const [sortOrder, project] of source.projects.entries()) {
    const slug = slugify(project.name);
    const input = { slug, name: project.name, year: Number(project.year), description: project.description, externalUrl: project.link === "#" ? null : project.link ?? null, coverImageUrl: project.image, landscapeImageUrl: project.mockup16x9 ?? null, type: project.type, organizer: project.organizer, competition: project.competition, problem: project.problem, solution: project.solution, status: "published" as const, featured: sortOrder < 3, sortOrder, tags: project.tags, timeline: project.timeline, mockups: project.mockups.map((mockup) => ({ title: mockup.title, imageUrl: mockup.image, altText: `${project.name} - ${mockup.title}` })), contributors: contributors(project.team) };
    const existing = await db.query.projects.findFirst({ where: eq(projects.slug, slug) });
    if (existing) await projectService.update(existing.id, input); else await projectService.create(input);
  }

  for (const [sortOrder, achievement] of source.achievements.entries()) {
    const input = { id: achievement.id, occurredAt: new Date(achievement.date), dateLabel: achievement.date, competitionName: achievement.competitionName, organizer: achievement.organizer, scale: achievement.scale, placement: achievement.placement, projectName: achievement.projectName, note: achievement.note, story: achievement.story, status: "published" as const, sortOrder, contributors: contributors(achievement.contributors) };
    const existing = await db.query.achievements.findFirst({ where: (table, { eq: equal }) => equal(table.id, achievement.id) });
    if (existing) await achievementService.update(achievement.id, input); else await achievementService.create(input);
    const doc = source.documentation[achievement.id];
    if (doc) await achievementService.upsertDocumentation(achievement.id, { category: doc.category, prototypeUrl: doc.prototypeUrl, proposalUrl: source.proposalUrl, summary: doc.summary, background: doc.background, solution: doc.solution, positioning: doc.positioning, sections: { objectives: doc.objectives, users: doc.users, innovations: doc.innovations, features: doc.features, limitations: doc.limitations, userFlow: doc.userFlow } });
  }

  const existingSteps = await db.query.processSteps.findMany({ orderBy: [asc(processSteps.sortOrder)] });
  for (const [sortOrder, step] of source.process.entries()) {
    const current = existingSteps.find((row) => row.label === step.label);
    await contentService.saveProcess(current?.id ?? null, { ...step, sortOrder, isActive: true });
  }

  const galleryUrls = ["/optimized/gallery/hero.webp", "/optimized/gallery/team-damar.webp", "/optimized/gallery/team-faruq.webp", "/optimized/gallery/team-febi.webp", "/optimized/gallery/mockup-landing.webp", "/optimized/gallery/mockup-16-9.webp"];
  for (const [sortOrder, url] of galleryUrls.entries()) {
    const existing = await db.query.mediaAssets.findFirst({ where: eq(mediaAssets.url, url) });
    await contentService.saveMedia(existing?.id ?? null, { kind: "image", url, altText: "Hihang Hoheng project gallery", galleryVisible: true, sortOrder, metadata: {} });
  }
  await contentService.setSetting("identity", { name: "Hihang Hoheng", description: "Competition-focused product design team" });
  await contentService.setSetting("about", { stats: [{ value: "12+", label: "Competitions joined" }, { value: "2", label: "Inter/national scales" }, { value: "5", label: "Awards & finalist runs" }], vision: "To become a consistent design competition team that carries campus-born work to broader stages.", mission: "To enter competitions with intention, build a clear research process, document every design decision, and help each member grow through work that can stand in front of judges." });
  await contentService.setSetting("mentor", { name: "Ajeng Rahma Sudarni, S.Pd., M.Pd.T.", role: "Dosen Pembimbing", imageUrl: "/src/assets/mentor.svg", imageAlt: "Dosen pembimbing Hihang Hoeng", description: "Her guidance helps Hihang Hoeng stay honest with the problem, careful with the process, and brave enough to keep refining the work." });
  await contentService.setSetting("footer", { email: "hello@hihanghoeng.com", instagramUrl: "https://www.instagram.com/", organization: "Universitas Negeri Semarang" });
  console.log(`Seeded ${source.projects.length} projects, ${source.achievements.length} achievements, and ${source.team.length} team members.`);
}

seed().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => pool.end());
