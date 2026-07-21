import { Router } from "express";
import { achievementService } from "../services/achievement.service.js";

export const achievementRouter = Router();

achievementRouter.get("/", async (_req, res) => {
  res.json({ data: await achievementService.list() });
});

achievementRouter.get("/:id", async (req, res) => {
  res.json({ data: await achievementService.get(req.params.id) });
});

achievementRouter.get("/:id/documentation", async (req, res) => {
  const achievement = await achievementService.get(req.params.id);
  res.json({ data: achievement.documentation });
});
