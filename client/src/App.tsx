import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import AuthLayout from "./features/auth/layouts/AuthLayout";
import LoginPage from "./features/auth/pages/LoginPage";
import SignUpPage from "./features/auth/pages/SignUpPage";
import VerifyOtpPage from "./features/auth/pages/VerifyOtpPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import { Toaster } from "react-hot-toast";

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes inside AuthLayout */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="verify-otp" element={<VerifyOtpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
