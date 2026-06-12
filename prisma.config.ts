
import { config } from "dotenv"
import { defineConfig, env } from "prisma/config";

config({ path: ".env" });
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  // Only override datasource when DIRECT_URL is set (local migrations).
  // On Vercel (where DIRECT_URL is absent), this block is omitted so
  // prisma generate can run without needing a DB connection.
  ...(process.env.DIRECT_URL && {
    datasource: {
      url: env("DIRECT_URL"),
    },
  }),
});

