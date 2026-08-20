import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, replace, useNavigate } from "react-router";
import { ArrowLeft, ShieldCheck, Lock, Eye, EyeOff, Check, Circle } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { changePassword } from "../services/profile.services";

interface PasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface formError {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// PATCH /api/users/change-password
// Dedicated page allowing authenticated users to update their password.
export default function ChangePasswordPage(): React.JSX.Element {
  const [passwords, setPasswords] = useState<PasswordState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<formError>({});
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPasswords((oldPasswords) => ({
      ...oldPasswords,
      [e.target.name]: e.target.value,
    }));
    setFormError((oldErrors) => ({
      ...oldErrors,
      [e.target.name]: "",
    }));
    setDisabled(false);
  };

  const hasMinLength = passwords.newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(passwords.newPassword);
  const hasLower = /[a-z]/.test(passwords.newPassword);
  const hasNumber = /[0-9]/.test(passwords.newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPassword);

  const checkPasswordRegex = (): boolean => {
    return hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const errors: formError = {};

    if (!passwords.currentPassword.trim()) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwords.newPassword.trim()) {
      errors.newPassword = "New password is required";
    }
    if (!passwords.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!checkPasswordRegex()) {
      errors.newPassword = "Invalid Format must follow below rules";
    }

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }
    const data = {
      currentPassword: passwords.currentPassword,
      newPassword: passwords.confirmPassword,
    };
    try {
      setLoading(true);
      await changePassword(data);
      toast.success("Password updated successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      navigate("/profile", { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message ?? "Failed to update password");
      } else {
        toast.error("Something unexpected happened");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setFormError({});
  };

  useEffect(() => {
    if (!passwords.currentPassword && !passwords.newPassword && !passwords.confirmPassword) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [passwords, loading]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <div className="space-y-4">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1 rounded-md group-hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Profile
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Change Password
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Update your password to keep your account secure.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[560px] mx-auto space-y-6">
        {/* 2. SECURITY CARD */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header Area */}
              <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Update your password</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Choose a strong password that you don't use elsewhere.
                  </p>
                </div>
              </div>

              {/* 3. PASSWORD FORM */}
              <div className="space-y-5">
                {/* Current Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="currentPassword"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full bg-background border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground shadow-xs ${
                        formError.currentPassword
                          ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                          : "border-border focus:ring-primary/50 focus:border-primary hover:border-border/80"
                      }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formError.currentPassword && (
                    <p className="text-red-400 text-xs mt-1 font-medium">
                      {formError.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2 pt-2">
                  <label
                    htmlFor="newPassword"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full bg-background border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground shadow-xs ${
                        formError.newPassword
                          ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                          : "border-border focus:ring-primary/50 focus:border-primary hover:border-border/80"
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formError.newPassword && (
                    <p className="text-red-400 text-xs mt-1 font-medium">{formError.newPassword}</p>
                  )}
                </div>

                {/* Password Requirements Checklist */}
                <div className="bg-accent/30 rounded-xl p-4 space-y-2.5 border border-border/50">
                  <h4 className="text-xs font-semibold text-foreground">Password requirements:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      {hasMinLength ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Circle className="w-3 h-3 ml-[1px] mr-[1px] text-muted-foreground/50" />
                      )}
                      <span className={hasMinLength ? "text-foreground font-medium" : ""}>
                        At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      {hasUpper ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Circle className="w-3 h-3 ml-[1px] mr-[1px] text-muted-foreground/50" />
                      )}
                      <span className={hasUpper ? "text-foreground font-medium" : ""}>
                        One uppercase letter
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      {hasLower ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Circle className="w-3 h-3 ml-[1px] mr-[1px] text-muted-foreground/50" />
                      )}
                      <span className={hasLower ? "text-foreground font-medium" : ""}>
                        One lowercase letter
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      {hasNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Circle className="w-3 h-3 ml-[1px] mr-[1px] text-muted-foreground/50" />
                      )}
                      <span className={hasNumber ? "text-foreground font-medium" : ""}>
                        One number
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      {hasSpecial ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Circle className="w-3 h-3 ml-[1px] mr-[1px] text-muted-foreground/50" />
                      )}
                      <span className={hasSpecial ? "text-foreground font-medium" : ""}>
                        One special character
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2 pt-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full bg-background border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground shadow-xs ${
                        formError.confirmPassword
                          ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                          : "border-border focus:ring-primary/50 focus:border-primary hover:border-border/80"
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formError.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1 font-medium">
                      {formError.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 4. ACTIONS */}
            <div className="bg-accent/20 border-t border-border p-5 sm:px-8 sm:py-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={disabled || loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card cursor-pointer disabled:bg-blue-600/80 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* 5. SECURITY INFORMATION */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/30 border border-border">
          <div className="mt-0.5 text-primary">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Security tip</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Never share your password with anyone. Use a unique, strong password specifically for
              your CampusFlow account to keep your data secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
