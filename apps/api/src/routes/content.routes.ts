import { Router } from "express";
import { contentService } from "../services/content.service.js";

export const contentRouter = Router();

contentRouter.get("/site", async (_req, res) => {
  res.json({ data: await contentService.getSettings() });
});

contentRouter.get("/process", async (_req, res) => {
  res.json({ data: await contentService.listProcess() });
});

contentRouter.get("/mentor", async (_req, res) => {
  res.json({ data: await contentService.getSetting("mentor") });
});

contentRouter.get("/media/gallery", async (_req, res) => {
  res.json({ data: await contentService.listMedia(true) });
});
