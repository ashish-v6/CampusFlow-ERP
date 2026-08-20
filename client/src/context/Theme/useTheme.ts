import { useContext } from "react";
import { ThemeContext, ThemeProviderState } from "./ThemeContext";

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeContext);

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
