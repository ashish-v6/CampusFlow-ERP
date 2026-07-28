import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate('/verify-otp');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-7rem)]">

      {/* Form Section */}
      <section className="w-full lg:w-[45%] xl:w-[42%] flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 bg-slate-950">
        <div className="max-w-md w-full my-auto space-y-6">

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Sign in to CampusFlow
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Welcome back! Please enter your credentials to access your portal.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@university.edu"
                    className={`w-full bg-slate-950 border rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-500/80 focus:ring-red-500/40 focus:border-red-500'
                        : 'border-slate-800 focus:ring-blue-500/50 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full bg-slate-950 border rounded-xl pl-11 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-red-500/80 focus:ring-red-500/40 focus:border-red-500'
                        : 'border-slate-800 focus:ring-blue-500/50 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
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
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/40 cursor-pointer"
                  />
                  <span className="text-slate-300 group-hover:text-white transition-colors">Remember me</span>
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
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group text-sm cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

            </form>

            {/* Bottom Link */}
            <div className="text-center pt-2 text-sm text-slate-400 border-t border-slate-800/80">
              <span>Don't have an account? </span>
              <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors ml-1">
                Create one
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Hero Image Section */}
      <section className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative p-12 flex-col justify-end overflow-hidden border-l border-slate-800/80">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop"
            alt="Modern Educational Campus Architecture"
            className="w-full h-full object-cover object-center filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-blue-950/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Clean Hero Caption */}
        <div className="relative z-10 max-w-lg space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Next-Generation Campus Intelligence
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Streamline administrative workflows, student lifecycle management, and academic analytics from a single platform.
          </p>
        </div>

      </section>

    </div>
  );
}
