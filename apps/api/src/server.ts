import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/index.js";

const server = app.listen(env.PORT, () => {
  console.log(`API listening on ${env.BETTER_AUTH_URL}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
