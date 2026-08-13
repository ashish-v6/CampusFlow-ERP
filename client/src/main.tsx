import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./context/Auth/AuthProvider.tsx";
import { ThemeProvider } from "./context/Theme/ThemeProvider.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <ThemeProvider defaultTheme="dark" storageKey="campusflow-ui-theme">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>,
  );
}
