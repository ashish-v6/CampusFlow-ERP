import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Check,
  ShieldCheck,
} from "lucide-react";

interface ResetPasswordFormData {
  newPassword: string;
  confirmNewPassword: string;
}

interface ResetPasswordFormErrors {
  newPassword?: string;
  confirmNewPassword?: string;
}

export default function ResetPasswordPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ResetPasswordFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newErrors: ResetPasswordFormErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    }
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirm new password is required";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 min-h-[calc(100vh-7rem)]">
      <div className="max-w-md w-full my-auto space-y-6">
        {/* Reset Password Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 text-center">
          {/* Circular Icon Illustration & Badge */}
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto shadow-md shadow-blue-500/10">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>RESET PASSWORD</span>
            </div>

            <div className="space-y-2 pt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create a new password
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                Choose a strong password for your CampusFlow account that is
                easy for you to remember and difficult for others to guess.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            className="space-y-5 text-left"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* New Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="new-password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`w-full bg-slate-950 border rounded-xl pl-11 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.newPassword
                      ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                      : "border-slate-800 focus:ring-blue-500/50 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle new password visibility"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-400 text-xs mt-1 font-medium">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="confirm-new-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={`w-full bg-slate-950 border rounded-xl pl-11 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmNewPassword
                      ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                      : "border-slate-800 focus:ring-blue-500/50 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle confirm new password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-red-400 text-xs mt-1 font-medium">
                  {errors.confirmNewPassword}
                </p>
              )}
            </div>

            {/* Password Requirements Checklist Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2">
              <span className="block font-semibold text-slate-300">
                Password requirements:
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-400 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>One uppercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>One number</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>One special character</span>
                </div>
              </div>
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm transition-all flex items-center justify-center gap-2 group mt-1 cursor-pointer"
            >
              <span>Update Password</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Bottom Link */}
          <div className="pt-2 text-sm text-slate-400 border-t border-slate-800/80">
            <span>Back to </span>
            <Link
              to="/login"
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
