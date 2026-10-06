import React from "react";
import { useAuth } from "../context/Auth/useAuth";
import MainLayout from "./MainLayout";
import AuthLayout from "../features/auth/layouts/AuthLayout";

/**
 * Dynamically renders MainLayout if the user is authenticated (with navigation, profile, and user footer),
 * or AuthLayout if unauthenticated (with public navigation and auth footer).
 */
export default function AdaptiveLayout(): React.JSX.Element {
  const { user } = useAuth();
  if (user) {
    return <MainLayout />;
  }
  return <AuthLayout />;
}
