import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Mail, MailCheck, Sparkles, ArrowRight, RefreshCw, Info } from "lucide-react";
import { sendOTP, verifyOtp } from "../services/auth.services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface VerifyOtpFormData {
  email: string;
  otp: string[];
}

interface VerifyOtpFormErrors {
  email?: string;
  otp?: string;
}

export default function VerifyOtpPage(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [formData, setFormData] = useState<VerifyOtpFormData>({
    email: email ?? "john@campusflow.org",
    otp: ["", "", "", "", "", ""],
  });
  const [errors, setErrors] = useState<VerifyOtpFormErrors>({});
  const [emailError, setEmailError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, email: value }));
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleOtpChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev) => ({ ...prev, otp: newOtp }));
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const handleSendOtp = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      toast.error("Email address is required");
      return Promise.reject();
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      toast.error("Invalid Email format");
      return Promise.reject();
    }

    try {
      setCountdown(120);
      const res = await sendOTP({ email: formData.email });
      toast.success("Otp is sent to registered mail address");
      console.log("test");
      return Promise.resolve();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        toast.error("Something unexpected happened");
      }
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const newErrors: VerifyOtpFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    }

    if (formData.otp.some((digit) => digit === "")) {
      newErrors.otp = "6-digit verification code is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      email: formData.email,
      otp: formData.otp.join(""),
    };

    setLoading(true);
    try {
      const res = await verifyOtp(data);

      toast.success("User Verified");

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
        {/* Verification Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 text-center">
          {/* Circular Icon Illustration & Badge */}
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto shadow-md shadow-blue-500/10">
              <MailCheck className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>EMAIL VERIFICATION</span>
            </div>

            <div className="space-y-2 pt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Verify your email
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                Enter your email address and the 6-digit verification code sent to your inbox.
              </p>
            </div>
          </div>

          {/* Verification Form */}
          <form className="space-y-5 text-left" onSubmit={handleSubmit} noValidate>
            {/* Email Address Field */}
            <div className="space-y-2">
              <label
                htmlFor="verify-email"
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
                  id="verify-email"
                  name="email"
                  value={formData.email}
                  onChange={handleEmailChange}
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

            {/* 6-Digit OTP Input Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                6-Digit Verification Code
              </label>
              <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
                {formData.otp.map((digit, index) => (
                  <input
                    key={index}
                    type="number"
                    max={9}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleOtpChange(index, e.target.value)
                    }
                    aria-label={`OTP Digit ${index + 1}`}
                    className={`w-full h-12 text-center text-lg font-bold text-white bg-slate-950 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.otp
                        ? "border-red-500/80 focus:ring-red-500/40"
                        : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/50"
                    }`}
                  />
                ))}
              </div>
              {errors.otp && <p className="text-red-400 text-xs mt-1 font-medium">{errors.otp}</p>}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={countdown > 0}
                className={`w-full ${countdown > 0 ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-200 cursor-pointer"} border font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 group order-2 sm:order-1`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${countdown > 0 ? "text-slate-500" : "text-slate-400 group-hover:rotate-180"} transition-transform duration-300`}
                />
                <span>{countdown > 0 ? `Resend in ${countdown}s` : "Send OTP"}</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm transition-all flex items-center justify-center gap-2 group order-1 sm:order-2 cursor-pointer disabled:bg-blue-600/60  disabled:cursor-noy-allowed"
              >
                {loading ? "Verifing..." : "Verify OTP"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>

          {/* Additional Information Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-300">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Didn't receive the code?</span>
            </div>
            <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1 leading-relaxed">
              <li>Check your spam or junk folder.</li>
              <li>Ensure your email address is typed correctly.</li>
              <li>Click "Send OTP" to request a new verification code.</li>
            </ul>
          </div>

          {/* Bottom Link */}
          <div className="pt-2 text-sm text-slate-400 border-t border-slate-800/80">
            <span>Already verified? </span>
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
