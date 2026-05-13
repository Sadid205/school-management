"use client";

import {
    useForgotPasswordMutation,
    useResetPasswordMutation,
} from "@/store/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ForgotForm {
  email: string;
}

interface ResetForm {
  new_password: string;
  confirm_password: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotPassword, { isLoading: isEmailLoading }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotForm>();

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    watch,
    formState: { errors: resetErrors },
  } = useForm<ResetForm>();

  const newPassword = watch("new_password");

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

  const onEmailSubmit = async (data: ForgotForm) => {
    try {
      await forgotPassword(data).unwrap();
      setEmail(data.email);
      setStep("otp");
      startTimer();
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send OTP");
    }
  };

  const onResetSubmit = async (data: ResetForm) => {
    if (data.new_password !== data.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      await resetPassword({
        email,
        otp: otpCode,
        new_password: data.new_password,
      }).unwrap();
      toast.success("Password reset successful! Please login");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to reset password");
    }
  };

  const handleResend = async () => {
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("OTP resent!");
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

  return (
    <div>
      {/* Step 1: Email Input */}
      {step === "email" && (
        <div>
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-navy">
              পাসওয়ার্ড রিসেট
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              আপনার ইমেইল দিন, OTP পাঠানো হবে
            </p>
          </div>

          <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  {...registerEmail("email", { required: "Email is required" })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none"
                  placeholder="example@school.edu"
                />
              </div>
              {emailErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {emailErrors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isEmailLoading}
              className="w-full py-3.5 bg-navy text-white font-semibold rounded-lg hover:bg-navy-mid transition-colors disabled:opacity-50"
            >
              {isEmailLoading ? "Sending..." : "OTP পাঠান →"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-navy-light hover:underline"
              >
                ← লগইন পেজে ফিরুন
              </button>
            </p>
          </form>
        </div>
      )}

      {/* Step 2: OTP Input */}
      {step === "otp" && (
        <div>
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-navy">OTP যাচাই করুন</h1>
            <p className="text-gray-500 text-sm mt-1">
              {email} এ ৬ সংখ্যার কোড পাঠানো হয়েছে
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="flex-1 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-amber outline-none"
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mb-6">
            কোড পাননি?{" "}
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-amber font-semibold hover:underline"
              >
                আবার পাঠান
              </button>
            ) : (
              <span className="text-amber font-semibold">
                00:{timer.toString().padStart(2, "0")}
              </span>
            )}
          </p>

          <button
            onClick={() => {
              const otpCode = otp.join("");
              if (otpCode.length !== 6) {
                toast.error("Please enter complete OTP");
                return;
              }
              setStep("reset");
            }}
            className="w-full py-3.5 bg-amber text-navy font-semibold rounded-lg hover:bg-amber-light transition-colors"
          >
            যাচাই করুন →
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            <button
              onClick={() => setStep("email")}
              className="text-navy-light hover:underline"
            >
              ← ভিন্ন ইমেইল ব্যবহার করুন
            </button>
          </p>
        </div>
      )}

      {/* Step 3: Reset Password */}
      {step === "reset" && (
        <div>
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-navy">নতুন পাসওয়ার্ড</h1>
            <p className="text-gray-500 text-sm mt-1">
              আপনার নতুন পাসওয়ার্ড সেট করুন
            </p>
          </div>

          <form onSubmit={handleResetSubmit(onResetSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                নতুন পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...registerReset("new_password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none"
                  placeholder="নতুন পাসওয়ার্ড"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {resetErrors.new_password && (
                <p className="text-red-500 text-xs mt-1">
                  {resetErrors.new_password.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...registerReset("confirm_password", {
                    required: "Please confirm password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none"
                  placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {resetErrors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {resetErrors.confirm_password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isResetLoading}
              className="w-full py-3.5 bg-navy text-white font-semibold rounded-lg hover:bg-navy-mid transition-colors disabled:opacity-50"
            >
              {isResetLoading ? "Resetting..." : "পাসওয়ার্ড পরিবর্তন করুন ✓"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-navy-light hover:underline"
              >
                ← লগইন পেজে ফিরুন
              </button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
