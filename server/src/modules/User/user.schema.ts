import { z } from "zod";
import { UserStatus } from "../../generated/prisma/enums.js";

class UserSchema {
  public updateUserProfileSchema = z
    .object({
      firstName: z
        .string()
        .trim()
        .min(3, "firstName must be of 3 characters")
        .max(10, "Too Long Name")
        .optional(),
      lastName: z
        .string()
        .trim()
        .min(3, "LastName must be of 3 characters")
        .max(10, "Too Long Name")
        .optional(),
      phone: z.string().trim().min(1, "Value cannot be empty").optional(),
      avatar: z.string().trim().min(1, "Value cannot be empty").optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    });

  public updatePasswordSchema = z.object({
    currentPassword: z.string().trim().min(1, "Current Password is requried"),
    newPassword: z
      .string()
      .trim()
      .min(1, "New Password is required")
      .regex(/[A-Z]/, "Password must contain at least one uppercase")
      .regex(/[a-z]/, "Password must contain at least one lowercase")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special Character"),
  });

  public getAllUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1, "Page number is required"),
    limit: z.coerce
      .number()
      .int()
      .min(1, "limit is required")
      .max(10, "Only 10 record can be fetched"),
  });

  public veifyIdParamsSchema = z.object({
    id: z.string().trim().min(1, "Id is required"),
  });

  public upateUserStatusSchema = z.object({
    status: z.enum(UserStatus),
  });
}

export const userSchema = new UserSchema();
