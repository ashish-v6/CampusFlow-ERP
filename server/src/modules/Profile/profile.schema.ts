import { z } from "zod";

export class ProfileSchema {
  /**
   * Schema for updating own profile.
   * Uses .strict() to reject forbidden/privileged fields like role, status, email, id, etc.
   */
  public updateProfileSchema = z
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
      phone: z
        .string()
        .trim()
        .regex(/^(?:\+91[\s\-]?)?\d{10}$/, "Phone number must be 10 digits (optional +91 prefix)")
        .optional()
        .or(z.literal("")),
      address: z
        .string()
        .trim()
        .max(255, "Address must be at most 255 characters")
        .optional()
        .or(z.literal("")),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one editable field is required",
    });

  /**
   * Password change schema verifying current password and enforcing strength on new password.
   */
  public changePasswordSchema = z
    .object({
      currentPassword: z.string().trim().min(1, "Current password is required"),
      newPassword: z
        .string()
        .trim()
        .min(8, "New password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    })
    .strict()
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must be different from current password",
      path: ["newPassword"],
    });
}

export const profileSchema = new ProfileSchema();
