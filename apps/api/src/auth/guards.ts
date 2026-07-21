import type { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";

export const requireSession: RequestHandler = async (req, res, next) => {
  const current = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!current) {
    res.status(401).json({ error: { message: "Authentication required" } });
    return;
  }
  res.locals.auth = current;
  next();
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  const current = res.locals.auth as { user?: { role?: string } } | undefined;
  if (current?.user?.role !== "admin") {
    res.status(403).json({ error: { message: "Admin access required" } });
    return;
  }
  next();
};
