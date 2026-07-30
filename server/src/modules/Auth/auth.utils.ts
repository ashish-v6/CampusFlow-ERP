import crypto from "crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import _config from "../../config/config.js";

class AuthUtils {
  public readonly cookie_config = {
    httpOnly: true,
    secure: _config.environment === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  public generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  public generateHash = (data: string): string => {
    return crypto.createHash("sha256").update(data).digest("hex");
  };

  public createAccessToken = (id: string, email: string): string => {
    return jwt.sign({ userId: id, email: email, jti: crypto.randomUUID() }, _config.accessKey, {
      expiresIn: "15m",
    });
  };
  public createRefreshToken = (id: string, seesionId: string): string => {
    return jwt.sign(
      { userId: id, sessionId: seesionId, jti: crypto.randomUUID() },
      _config.refreshKey,
      { expiresIn: "15m" },
    );
  };
  public decodeAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, _config.accessKey) as JwtPayload & { id: string; email: string };
  };
  public decodeRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, _config.accessKey) as JwtPayload & { id: string; sessionId: string };
  };
}

const authUtils = new AuthUtils();
export default authUtils;
