import cors from "cors";
import express from "express";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./lib/errors.js";
import { achievementRouter } from "./routes/achievement.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { contentRouter } from "./routes/content.routes.js";
import { projectRouter } from "./routes/project.routes.js";
import { setupRouter } from "./routes/setup.routes.js";
import { teamRouter } from "./routes/team.routes.js";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));

// Better Auth needs the raw request body, so this must precede express.json().
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ data: { status: "ok" } }));
app.use("/api/setup", setupRouter);
app.use("/api/projects", projectRouter);
app.use("/api/achievements", achievementRouter);
app.use("/api/team", teamRouter);
app.use("/api", contentRouter);
app.use("/api/admin", adminRouter);

app.use(notFound);
app.use(errorHandler);
