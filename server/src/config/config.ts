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
  baseUrl: getEnv("BASE_URL"),
  accessKey: getEnv("ACCESS_SECERT_KEY"),
  refreshKey: getEnv("REFRESH_TOKEN_KEY"),
  clientUrl: getEnv("CLIENT_URL"),
  mailUser: getEnv("MAIL_USER"),
  mailClientId: getEnv("MAIL_CLIENT_ID"),
  mailClientSecret: getEnv("MAIL_CLIENT_SECERT"),
  mailRefreshToken: getEnv("MAIL_REFRESH_TOKEN"),
};

export default Object.freeze(_config);
