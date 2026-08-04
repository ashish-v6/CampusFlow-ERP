import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import _config from "../../config/config.js";
import type { CookieConfig } from "./auth.types.js";

class AuthUtils {
  public readonly cookie_config: CookieConfig = {
    httpOnly: true,
    secure: _config.environment === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  public  hashPassword = async (password : string) :Promise<string> => {
    return bcrypt.hash(password, 11);
  }

  public comparePassword = async (password : string, savedPassword : string) : Promise<boolean> => {
    return bcrypt.compare(password, savedPassword);
  }

  public generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  public generateHash = (data: string): string => {
    return crypto.createHash("sha256").update(data).digest("hex");
  };

  public generateRandomToken = () : string => {
    return crypto.randomBytes(32).toString("hex");
  }

  public createAccessToken = (id: string, email: string, role : string, sessionId: string): string => {
    return jwt.sign(
      { userId: id, email: email, role : role, seesionId: sessionId, jti: crypto.randomUUID() },
      _config.accessKey,
      {
        expiresIn: "15m",
      },
    );
  };

  public createRefreshToken = (id: string, email : string): string => {
    return jwt.sign({ userId: id,email : email, jti: crypto.randomUUID() }, 
    _config.refreshKey, 
    {
      expiresIn: "7d",
    });
  };

  public verifyAccessToken = (token: string): JwtPayload | null=> {
    return jwt.verify(token, _config.accessKey) as JwtPayload & { id: string; email: string, role : string } | null;
  };

  public verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, _config.refreshKey) as JwtPayload & { id: string; email : string};
  };
}

const authUtils = new AuthUtils();
export default authUtils;
