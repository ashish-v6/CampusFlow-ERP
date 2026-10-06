import _config from "../config/config.js";
import { PrismaClient } from "../generated/prisma/client.js";

// Ensure compatibility if generated client schema still has CLOUD_DATABASE_URL
if (!process.env.CLOUD_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.CLOUD_DATABASE_URL = process.env.DATABASE_URL;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: _config.databaseUrl,
    },
  },
});

export default prisma;
