import { Router } from "express";
import { teamService } from "../services/team.service.js";

export const teamRouter = Router();

teamRouter.get("/", async (_req, res) => {
  res.json({ data: await teamService.list() });
});
