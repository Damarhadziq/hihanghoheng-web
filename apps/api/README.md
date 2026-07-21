# Hihang Hoheng API

Express 5 API for the portfolio content, using Drizzle ORM, PostgreSQL, and Better Auth.

## Local setup

1. Copy `.env.example` to `.env` and replace `BETTER_AUTH_SECRET`.
2. Start PostgreSQL with `docker compose up -d` or point `DATABASE_URL` at an existing database.
3. Run `npm install`.
4. Run `npm run db:generate` and `npm run db:migrate`.
5. Run `npm run db:seed` to import the current frontend content.
6. Run `npm run dev`; the API defaults to `http://localhost:4000`.

Create the first account through `POST /api/auth/sign-up/email`, then promote it once in PostgreSQL:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'owner@example.com';
```

## Route boundaries

Public reads live under `/api/projects`, `/api/achievements`, `/api/team`, `/api/process`, `/api/mentor`, `/api/media/gallery`, and `/api/site`. Better Auth owns `/api/auth/*`.

CMS writes live under `/api/admin/*`. Signed-in editors can create and update content. Deletions and site-setting changes require the `admin` role. Project, achievement, team, and general content logic is kept in separate service modules; routes only validate HTTP input and format the response.

Media endpoints store metadata and a URL. Put binaries in object storage or the frontend's static asset host, then save the resulting URL through `/api/admin/media`.
