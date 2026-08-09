import { z } from "zod";

class UserSchema {
  public updateUserProfileSchema = z
  .object({
    firstName: z.string().trim().min(1, "Value cannot be empty").optional(),
    lastName: z.string().trim().min(1, "Value cannot be empty").optional(),
    phone: z.string().trim().min(1, "Value cannot be empty").optional(),
    avatar: z.string().trim().min(1, "Value cannot be empty").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
}

export const userSchema = new UserSchema();
