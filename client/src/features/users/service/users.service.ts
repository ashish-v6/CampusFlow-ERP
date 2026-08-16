import api from "../../../api/axios.js";
import { UserPagination } from "../users.types";

export const fetchUsers = async (data: UserPagination) => {
  const res = await api.get("/api/users/users", { params: data });
  return res.data;
};
export const getUsersStatus = async () => {
  const res = await api.get("/api/users/users-status");
  return res.data;
};
export const fetchUser = async (id: string) => {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
};
export const setUsersStatus = async (id: string, data: { status: string }) => {
  const res = await api.patch(`api/users/${id}/status`, data);
  return res.data;
};
export const deactivateUser = async (id: string) => {
  const res = await api.delete(`api/users/${id}`);
  return res.data;
};