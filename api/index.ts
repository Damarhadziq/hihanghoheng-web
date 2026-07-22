import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../apps/api/src/app.js";

type VercelRequest = IncomingMessage & {
  url?: string;
};

export default function handler(req: VercelRequest, res: ServerResponse) {
  const url = new URL(req.url ?? "/api", "http://localhost");
  const route = url.searchParams.get("route") ?? "";

  url.searchParams.delete("route");
  req.url = `/api/${route}${url.search}`;

  return app(req, res);
}