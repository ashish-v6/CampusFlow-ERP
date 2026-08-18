import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, MailSearch, Sparkles, ArrowRight, Info } from "lucide-react";
import { forgotPassword } from "../services/auth.services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

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
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ForgotPasswordFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const newErrors: ForgotPasswordFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(formData);
      console.log(res);
      toast.success("Reset Link is sent to email");
      navigate("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        toast.error("Something unexpected happened");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 min-h-[calc(100vh-7rem)]">
      <div className="max-w-md w-full my-auto space-y-6">
        {/* Forgot Password Card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 text-center">
          {/* Circular Icon Illustration & Badge */}
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-md shadow-primary/10">
              <MailSearch className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>PASSWORD RECOVERY</span>
            </div>

            <div className="space-y-2 pt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Forgot your password?
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
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
                className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="recovery-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  className={`w-full bg-input/50 border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                      : "border-border focus:ring-primary/50 focus:border-primary"
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
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm transition-all flex items-center justify-center gap-2 group mt-1 cursor-pointer disabled:cursor-not-allowed disabled:bg-primary/60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Additional Information Card */}
          <div className="bg-accent/30 border border-border rounded-xl p-4 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground/80">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <span>What happens next?</span>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-1 leading-relaxed">
              <li>We'll send a password reset link to your email address.</li>
              <li>The security link will expire after a short period.</li>
              <li>Check your spam folder if you don't receive the email.</li>
            </ul>
          </div>

          {/* Bottom Link */}
          <div className="pt-2 text-sm text-muted-foreground border-t border-border/80">
            <span>Remember your password? </span>
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
