import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, MailSearch, Sparkles, ArrowRight, Info } from "lucide-react";

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormErrors {
  email?: string;
}

export default function ForgotPasswordPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ForgotPasswordFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newErrors: ForgotPasswordFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate("/reset-password");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 min-h-[calc(100vh-7rem)]">
      <div className="max-w-md w-full my-auto space-y-6">
        {/* Forgot Password Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 text-center">
          {/* Circular Icon Illustration & Badge */}
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto shadow-md shadow-blue-500/10">
              <MailSearch className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>PASSWORD RECOVERY</span>
            </div>

            <div className="space-y-2 pt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Forgot your password?
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                Enter the email associated with your account. We'll send you a secure password reset
                link.
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5 text-left" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="recovery-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="recovery-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  className={`w-full bg-slate-950 border rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                      : "border-slate-800 focus:ring-blue-500/50 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm transition-all flex items-center justify-center gap-2 group mt-1 cursor-pointer"
            >
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Additional Information Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-300">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>What happens next?</span>
            </div>
            <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1 leading-relaxed">
              <li>We'll send a password reset link to your email address.</li>
              <li>The security link will expire after a short period.</li>
              <li>Check your spam folder if you don't receive the email.</li>
            </ul>
          </div>

          {/* Bottom Link */}
          <div className="pt-2 text-sm text-slate-400 border-t border-slate-800/80">
            <span>Remember your password? </span>
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
