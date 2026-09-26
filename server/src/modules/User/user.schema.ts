import { z } from "zod";
import { Roles, UserStatus } from "../../generated/prisma/enums.js";

class UserSchema {
  public createUserSchema = z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be at most 50 characters"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be at most 50 characters"),
    email: z.string().trim().email("Invalid email address").toLowerCase(),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    role: z.enum(Roles).default("STUDENT"),
    status: z.enum(UserStatus).default("ACTIVE"),
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .trim()
      .max(255, "Address must be at most 255 characters")
      .optional()
      .or(z.literal("")),
  });

  public updateUserProfileSchema = z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, "First name cannot be empty")
        .max(50, "First name must be at most 50 characters")
        .optional(),
      lastName: z
        .string()
        .trim()
        .min(1, "Last name cannot be empty")
        .max(50, "Last name must be at most 50 characters")
        .optional(),
      phone: z.string().trim().min(5, "Invalid phone number").max(20).optional(),
      address: z.string().trim().min(1).max(255).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    });

  public updatePasswordSchema = z.object({
    currentPassword: z.string().trim().min(1, "Current Password is required"),
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
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .min(1, "limit is required")
      .max(100, "Maximum 100 records can be fetched")
      .default(10),
    search: z.string().trim().optional(),
    role: z.enum(Roles).optional(),
    status: z.enum(UserStatus).optional(),
  });

  public veifyIdParamsSchema = z.object({
    id: z.string().trim().min(1, "Id is required"),
  });

  public upateUserStatusSchema = z.object({
    status: z.enum(UserStatus),
  });
}

export const userSchema = new UserSchema();
