import api from "../api/axios.js";
import * as authTypes from "../types/auth.types.js";

export const signUp = async (data: authTypes.SignUp) => {
  const res = api.post("/api/auth/sign-up", data);
  return (await res).data;
};
