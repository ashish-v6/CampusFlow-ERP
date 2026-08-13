import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import { signUp } from "../services/auth.services";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface SignUpFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function SignUpPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof SignUpFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const newErrors: SignUpFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.terms) {
      newErrors.terms = "You must agree to the Terms of Service & Privacy Policy";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const reqData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };
    try {
      const data = await signUp(reqData);

      toast.success("User Registered Successfully");
      navigate("/verify-otp", { state: { email: data.user.email } });
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
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Get started with your CampusFlow workspace today.
            </p>
          </div>

          {/* Registration Card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className={`w-full bg-input/50 border rounded-xl pl-10 pr-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                        errors.firstName
                          ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                          : "border-border focus:ring-primary/50 focus:border-primary"
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className={`w-full bg-input/50 border rounded-xl pl-10 pr-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                        errors.lastName
                          ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                          : "border-border focus:ring-primary/50 focus:border-primary"
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@university.edu"
                    className={`w-full bg-input/50 border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
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

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className={`w-full bg-input/50 border rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className={`w-full bg-input/50 border rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                        : "border-border focus:ring-primary/50 focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Checkbox Terms & Privacy */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-border bg-input/50 text-primary focus:ring-primary/40 cursor-pointer mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                    I agree to the{" "}
                    <a href="#terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group text-sm mt-2 cursor-pointer disabled:bg-primary/60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Account"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            {/* Bottom Link */}
            <div className="text-center pt-2 text-sm text-muted-foreground border-t border-border/80">
              <span>Already have an account? </span>
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1"
              >
                Sign In
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
            Empowering Higher Education
          </h2>
          <p className="text-white/80 text-base leading-relaxed">
            Join hundreds of universities and institutions modernizing campus management with
            enterprise-grade security.
          </p>
        </div>
      </section>
    </div>
  );
}
