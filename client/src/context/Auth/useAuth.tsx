import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext) ?? null;

  if (!context) {
    throw new Error("The AuthProvider is null! can't access data");
  }
  return context;
};
