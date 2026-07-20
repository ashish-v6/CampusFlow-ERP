// src/config/env.ts
const required = ["DATABASE_URL", "PORT", "CLIENT_URL"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  port: process.env.PORT!,
  databaseUrl: process.env.DATABASE_URL!,
  clientUrl: process.env.CLIENT_URL!,
};