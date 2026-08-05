import { z } from "zod";

export class AuthSchema {
  public signUp = z.object({
    firstName: z.string().trim().min(2, "Firstname must be at least 2 characters").max(15),
    lastName: z.string().trim().min(2, "Lastname must be at least 2 characters").max(15),
    email: z.email().trim().toLowerCase(),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase")
      .regex(/[a-z]/, "Password must contain at least one lowercase")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special Character"),
  });

  public sendEmail = z.object({
    email: z.email().trim().toLowerCase(),
  });

  public verifyEmail = z.object({
    email: z.email().trim().toLowerCase(),
    otp: z.string().trim().min(6, "OTP must be of 6 digit").max(6, "OTP must be of 6 digit"),
  });

  public Login = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().trim().min(8, "Password must be at least 8 characters long"),
  });

  public ForgetPassword = z.object({
    email: z.string().trim().toLowerCase(),
  });

  public resetPassword = z.object({
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase")
      .regex(/[a-z]/, "Password must contain at least one lowercase")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special Character"),
    token: z.string().trim(),
  });

  public validateToken = z.object({
    token: z.string().trim(),
  });
}

export const authSchema = new AuthSchema();
