import api from "../../../api/axios.js";

interface updateUserPassword {
  currentPassword: string;
  newPassword: string;
}



export const getProfile = async () => {
  const res = api.get("/api/users/me");
  return (await res).data;
};
export const changeProfile = async (data: unknown) => {
  const res = api.patch("/api/users/me", data);
  return (await res).data;
};
export const changePassword = async (data : updateUserPassword) => {
  const res = await api.patch("/api/users/change-password",data);
  return res.data;
}