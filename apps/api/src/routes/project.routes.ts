import { Router } from "express";
import { projectService } from "../services/project.service.js";

export const projectRouter = Router();

projectRouter.get("/", async (_req, res) => {
  res.json({ data: await projectService.list() });
});

projectRouter.get("/:slug", async (req, res) => {
  res.json({ data: await projectService.getBySlug(req.params.slug) });
});
