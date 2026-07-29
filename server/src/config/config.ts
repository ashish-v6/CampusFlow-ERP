import { config as conf } from "dotenv";
import createHttpError from "http-errors";

conf();

/**
 * Helper function to safely get an environment variable.
 * Throws a 500 Internal Server Error if the variable is missing.
 */
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    // A missing environment variable is a server configuration issue, 
    // hence a 500 status code is the most appropriate.
    throw createHttpError(500, `CRITICAL: Environment variable ${key} is missing.`);
  }
  return value;
};

const _config = {
  port: getEnv("PORT"),
  databaseUrl: getEnv("DATABASE_URL"),
  environment: getEnv("NODE_ENV"),
  baseUrl : getEnv("BASE_URL"),
  clientUrl : getEnv("CLIENT_URL"),
};

export default Object.freeze(_config);