
import { config } from "dotenv"
import { defineConfig, env } from "prisma/config";

config({ path: ".env" });
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  // DIRECT_URL is optional — only needed for migrations/introspection.
  // When absent (e.g. Vercel build), prisma generate still works via DATABASE_URL.
  ...(process.env.DIRECT_URL && {
    datasource: {
      url: env("DIRECT_URL"),
    },
  }),
});

