// prisma.config.ts  (project root — used by Prisma CLI only, not bundled)
// ─────────────────────────────────────────────────────────────────────────────
// Prisma 7 introduces prisma.config.ts as the canonical place to configure
// CLI behaviour (migrations, introspection, studio).
//
// Why DIRECT_URL here, not DATABASE_URL?
//   DATABASE_URL points at Neon's connection pooler (-pooler hostname).
//   Prisma CLI commands like `migrate dev` need a direct TCP connection to
//   run DDL statements — poolers can't handle those. DIRECT_URL bypasses the
//   pooler and goes straight to the Neon compute.
// ─────────────────────────────────────────────────────────────────────────────


import { config } from "dotenv"
import { defineConfig, env } from "prisma/config";

config({ path: ".env" });
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DIRECT_URL_DEV"), // direct (non-pooled) connection for CLI
  },
});

