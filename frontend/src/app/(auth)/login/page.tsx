"use client";

import {
  useLoginMutation,
  useResendLoginOtpMutation,
  useVerifyLoginOtpMutation,
} from "@/services/store/api/auth-api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
} from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loginEmail, setLoginEmail] = useState("");
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [verifyOtp, { isLoading: isVerifyLoading }] =
    useVerifyLoginOtpMutation();
  const [resendOtp, { isLoading: isResendLoading }] =
    useResendLoginOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const startTimer = () => {
    setTimer(45);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = async (data: LoginForm) => {
    toast.loading("Sending OTP...", { id: "login" });

    try {
      const response = await login(data).unwrap();
      setLoginEmail(data.email);
      setShowOtpModal(true);
      startTimer();
      toast.success("OTP sent to your email!", { id: "login" });
    } catch (error: any) {
      toast.error(error.data?.message || "Login failed", { id: "login" });
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    toast.loading("Verifying OTP...", { id: "verifying" });

    try {
      const response = await verifyOtp({
        email: loginEmail,
        otp: otpCode,
      }).unwrap();

      // ✅ Cookie auto set হয়েছে browser এ!
      // ✅ লগইন সফল - এখন Dashboard এ যান

      toast.success("Login successful! Welcome back.", { id: "verifying" });
      router.push("/");
    } catch (error: any) {
      toast.error(error.data?.message || "Invalid OTP. Please try again.", {
        id: "verifying",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: loginEmail }).unwrap();
      toast.success("OTP resent successfully!");
      startTimer();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to resend OTP");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Auto submit when OTP is complete
  const handleAutoSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length === 6 && !isVerifyLoading) {
      await handleVerifyOtp();
    }
  };

  // Trigger auto-submit when OTP changes
  useState(() => {
    if (otp.join("").length === 6) {
      handleAutoSubmit();
    }
  });

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-md px-4 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-md bg-amber-pale">
            <LogIn size={32} className="text-amber" />
          </div>
          <h1 className="text-3xl font-bold text-navy">Welcome Back</h1>
          <p className="mt-2 text-gray-500">
            Login to your account and continue your journey
          </p>
        </div>

        {/* Login Form */}
        <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200 bg-red-50"
                      : "border-gray-200 focus:border-navy-light focus:ring-navy-light/20"
                  }`}
                  placeholder="ahmed@school.edu"
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200 bg-red-50"
                      : "border-gray-200 focus:border-navy-light focus:ring-navy-light/20"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-navy-light hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoginLoading}
              className="flex items-center justify-center w-full gap-2 py-3 mt-2 font-semibold text-white transition-all rounded-lg bg-navy hover:bg-navy-mid disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoginLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Register Link */}
            <p className="pt-2 text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="font-semibold text-navy-light hover:underline"
              >
                Create Account
              </button>
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Copyright © 2024 EduNest. All rights reserved.
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl">
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-pale">
                <Mail size={32} className="text-amber" />
              </div>
              <h3 className="text-xl font-bold text-navy">Verify Your Email</h3>
              <p className="mt-2 text-sm text-gray-500">
                We've sent a 6-digit verification code to
                <br />
                <span className="font-medium text-navy">{loginEmail}</span>
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-xl font-bold text-center transition-all border-2 border-gray-200 rounded-lg focus:border-amber focus:outline-none"
                  style={{
                    borderColor: digit ? "#F5A623" : "#E5E7EB",
                    backgroundColor: digit ? "#FFF7E6" : "white",
                  }}
                />
              ))}
            </div>

            <p className="mb-6 text-sm text-center text-gray-500">
              Didn't receive the code?{" "}
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  disabled={isResendLoading}
                  className="font-semibold text-amber hover:underline disabled:opacity-50"
                >
                  {isResendLoading ? "Sending..." : "Resend Code"}
                </button>
              ) : (
                <span className="font-semibold text-amber">
                  Resend in 00:{timer.toString().padStart(2, "0")}
                </span>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={isVerifyLoading}
                className="flex-1 py-2.5 bg-amber text-navy font-semibold rounded-lg hover:bg-amber-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifyLoading ? (
                  <div className="w-5 h-5 border-2 rounded-full border-navy border-t-transparent animate-spin" />
                ) : (
                  "Verify & Login"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
