import api from "../../../api/axios";
import {
  UpdatePasswordPayload,
  UpdateProfilePayload,
  User,
} from "../profile.types";

/**
 * Fetches authenticated user's own profile.
 * Backend: GET /api/profile
 */
export const getProfile = async (): Promise<{ user: User }> => {
  const res = await api.get<{ user: User }>("/api/profile");
  return res.data;
};

/**
 * Updates permitted personal profile fields (firstName, lastName, phone, address).
 * Backend: PATCH /api/profile
 */
export const changeProfile = async (
  data: UpdateProfilePayload,
): Promise<{ user: User; message: string }> => {
  const res = await api.patch<{ user: User; message: string }>("/api/profile", data);
  return res.data;
};

/**
 * Updates user password with secure verification.
 * Backend: PATCH /api/profile/change-password
 */
export const changePassword = async (
  data: UpdatePasswordPayload,
): Promise<{ success: boolean; message: string }> => {
  const res = await api.patch<{ success: boolean; message: string }>(
    "/api/profile/change-password",
    data,
  );
  return res.data;
};
