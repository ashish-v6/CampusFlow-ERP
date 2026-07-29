import { createContext } from "react";
import { AuthContextType } from "./Types.js";

export const AuthContext = createContext<AuthContextType | null>(null);
