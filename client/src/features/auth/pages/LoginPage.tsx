import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { loginUser } from "../services/auth.services";
import { useAuth } from "../../../context/Auth/useAuth";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage(): React.JSX.Element {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid Email format";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be ";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(formData);
      auth.login(result.accessToken, result.user);
      toast.success("Login Successful");
      navigate("/dashboard");
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
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-7rem)]">
      {/* Form Section */}
      <section className="w-full lg:w-[45%] xl:w-[42%] flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 bg-background">
        <div className="max-w-md w-full my-auto space-y-6">
          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Sign in to CampusFlow
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Welcome back! Please enter your credentials to access your portal.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
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
                    id="email"
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

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full bg-input/50 border rounded-xl pl-11 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                        : "border-border focus:ring-primary/50 focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-border bg-input/50 text-primary focus:ring-primary/40 cursor-pointer"
                  />
                  <span className="text-foreground/80 group-hover:text-foreground transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group text-sm cursor-pointer disabled:bg-primary/60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing..." : "Sign In"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <div className="text-center pt-2 text-sm text-muted-foreground border-t border-border/80">
              <span>Don't have an account? </span>
              <Link
                to="/signup"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors ml-1"
              >
                Create one
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative p-12 flex-col justify-end overflow-hidden border-l border-border/80">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop"
            alt="Modern Educational Campus Architecture"
            className="w-full h-full object-cover object-center filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-primary/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        </div>

        {/* Clean Hero Caption */}
        <div className="relative z-10 max-w-lg space-y-3 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Next-Generation Campus Intelligence
          </h2>
          <p className="text-white/80 text-base leading-relaxed">
            Streamline administrative workflows, student lifecycle management, and academic
            analytics from a single platform.
          </p>
        </div>
      </section>
    </div>
  );
}
