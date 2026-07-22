import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { count, sql } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { account, user } from "../db/schema.js";
import { AppError } from "../lib/errors.js";

const router = Router();

const firstAdminSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

router.get("/status", async (_req, res) => {
  const [result] = await db.select({ total: count() }).from(user);
  res.json({ data: { requiresSetup: (result?.total ?? 0) === 0 } });
});

router.post("/admin", async (req, res) => {
  const input = firstAdminSchema.parse(req.body);
  const password = await hashPassword(input.password);

  const created = await db.transaction(async (tx) => {
    // Serializes first-account creation across API instances sharing PostgreSQL.
    await tx.execute(sql`select pg_advisory_xact_lock(684249317)`);
    const [result] = await tx.select({ total: count() }).from(user);
    if ((result?.total ?? 0) > 0) {
      throw new AppError(409, "Setup awal sudah selesai. Silakan masuk dengan akun yang terdaftar.");
    }

    const userId = randomUUID();
    const [admin] = await tx.insert(user).values({
      id: userId,
      name: input.name,
      email: input.email,
      emailVerified: true,
      role: "admin",
    }).returning({ id: user.id, name: user.name, email: user.email, role: user.role });

    await tx.insert(account).values({
      id: randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password,
    });

    return admin;
  });

  res.status(201).json({ data: created });
});

export { router as setupRouter };