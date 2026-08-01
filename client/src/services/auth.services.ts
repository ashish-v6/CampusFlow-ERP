import api from "../api/axios.js";
import * as authTypes from "../types/auth.types.js";

export const signUp = async (data: authTypes.SignUp) => {
  const res = api.post("/api/auth/sign-up", data);
  return (await res).data;
};

export const sendOTP = async (data: { email: string }) => {
  const res = api.post("/api/auth/send-otp", data);
  return (await res).data;
};

export const verifyOtp = async (data: { email: string, otp : string }) => {
  const res = api.post("/api/auth/verify-email", data);
  return (await res).data;
};

export const loginUser = async (data : {email : string, password : string}) => {
  const res = api.post("/api/auth/login", data);
  return (await res).data;
}
export const rotateToken = async () => {
  const res = api.post("/api/auth/rotate");
  return (await res).data;
}
export const logoutUser = async () => {
  const res = api.post("/api/auth/logout");
  return (await res).data;
}

export const logoutAll = async () => {
  const res = api.post("/api/auth/logout-all");
  return (await res).data;
}

export const clearCookie = async () => {
  const res = api.post("/api/auth/clear-cookie");
  return (await res).data;
}