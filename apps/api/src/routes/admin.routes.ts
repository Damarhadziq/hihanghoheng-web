import { Router } from "express";
import { requireAdmin, requireSession } from "../auth/guards.js";
import { achievementService } from "../services/achievement.service.js";
import { contentService } from "../services/content.service.js";
import { projectService } from "../services/project.service.js";
import { teamService } from "../services/team.service.js";
import { achievementInput, documentationInput, mediaInput, processStepInput, projectInput, siteSettingInput, teamMemberInput } from "../validators/content.js";

export const adminRouter = Router();
adminRouter.use(requireSession);

const param = (value: string | string[] | undefined) => {
  if (typeof value !== "string") throw new Error("Missing route parameter");
  return value;
};

adminRouter.get("/projects", async (_req, res) => res.json({ data: await projectService.list(false) }));
adminRouter.post("/projects", async (req, res) => res.status(201).json({ data: await projectService.create(projectInput.parse(req.body)) }));
adminRouter.put("/projects/:id", async (req, res) => res.json({ data: await projectService.update(param(req.params.id), projectInput.parse(req.body)) }));
adminRouter.delete("/projects/:id", requireAdmin, async (req, res) => { await projectService.remove(param(req.params.id)); res.status(204).end(); });

adminRouter.get("/achievements", async (_req, res) => res.json({ data: await achievementService.list(false) }));
adminRouter.post("/achievements", async (req, res) => res.status(201).json({ data: await achievementService.create(achievementInput.parse(req.body)) }));
adminRouter.put("/achievements/:id", async (req, res) => res.json({ data: await achievementService.update(param(req.params.id), achievementInput.parse(req.body)) }));
adminRouter.put("/achievements/:id/documentation", async (req, res) => res.json({ data: await achievementService.upsertDocumentation(param(req.params.id), documentationInput.parse(req.body)) }));
adminRouter.delete("/achievements/:id", requireAdmin, async (req, res) => { await achievementService.remove(param(req.params.id)); res.status(204).end(); });

adminRouter.get("/team-members", async (_req, res) => res.json({ data: await teamService.list(false) }));
adminRouter.post("/team-members", async (req, res) => res.status(201).json({ data: await teamService.create(teamMemberInput.parse(req.body)) }));
adminRouter.put("/team-members/:id", async (req, res) => res.json({ data: await teamService.update(param(req.params.id), teamMemberInput.parse(req.body)) }));
adminRouter.delete("/team-members/:id", requireAdmin, async (req, res) => { await teamService.remove(param(req.params.id)); res.status(204).end(); });

adminRouter.get("/process", async (_req, res) => res.json({ data: await contentService.listProcess(false) }));
adminRouter.post("/process", async (req, res) => res.status(201).json({ data: await contentService.saveProcess(null, processStepInput.parse(req.body)) }));
adminRouter.put("/process/:id", async (req, res) => res.json({ data: await contentService.saveProcess(param(req.params.id), processStepInput.parse(req.body)) }));
adminRouter.delete("/process/:id", requireAdmin, async (req, res) => { await contentService.removeProcess(param(req.params.id)); res.status(204).end(); });

adminRouter.get("/media", async (_req, res) => res.json({ data: await contentService.listMedia() }));
adminRouter.post("/media", async (req, res) => res.status(201).json({ data: await contentService.saveMedia(null, mediaInput.parse(req.body)) }));
adminRouter.put("/media/:id", async (req, res) => res.json({ data: await contentService.saveMedia(param(req.params.id), mediaInput.parse(req.body)) }));
adminRouter.delete("/media/:id", requireAdmin, async (req, res) => { await contentService.removeMedia(param(req.params.id)); res.status(204).end(); });

adminRouter.get("/settings", async (_req, res) => res.json({ data: await contentService.getSettings() }));
adminRouter.put("/settings/:key", requireAdmin, async (req, res) => {
  const { value } = siteSettingInput.parse(req.body);
  res.json({ data: await contentService.setSetting(param(req.params.key), value) });
});
