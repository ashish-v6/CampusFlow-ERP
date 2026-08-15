import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import AuthLayout from "./features/auth/layouts/AuthLayout";
import MainLayout from "./components/MainLayout";

import LoginPage from "./features/auth/pages/LoginPage";
import SignUpPage from "./features/auth/pages/SignUpPage";
import VerifyOtpPage from "./features/auth/pages/VerifyOtpPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";

// Profile Feature Pages
import ProfilePage from "./features/profile/pages/ProfilePage";
import EditProfilePage from "./features/profile/pages/EditProfilePage";
import ChangePasswordPage from "./features/profile/pages/ChangePasswordPage";

// Users Feature Pages
import UserManagementPage from "./features/users/pages/UserManagementPage";
import UserDetailsPage from "./features/users/pages/UserDetailsPage";
import UpdateUserStatusPage from "./features/users/pages/UpdateUserStatusPage";
import DeactivateUserPage from "./features/users/pages/DeactivateUserPage";

import { Toaster } from "react-hot-toast";
import AccessDeniedPage from "./components/AccessDeniedPage";
import ProtectedRoute from "./routes/ProtectedRoute";

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

        {/* Authenticated Application Routes inside MainLayout (Header & Footer) */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Profile Feature Routes */}

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/change-password" element={<ChangePasswordPage />} />

            {/* Users Feature Routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/users/:id" element={<UserDetailsPage />} />
              <Route path="/users/:id/status" element={<UpdateUserStatusPage />} />
              <Route path="/users/:id/deactivate" element={<DeactivateUserPage />} />
            </Route>
            {/* {Forbidden Route} */}
            <Route path="/403" element={<AccessDeniedPage />} />
          </Route>
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
