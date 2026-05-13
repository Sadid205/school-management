"use client";

import { useAppDispatch } from "@/hooks/redux-hooks";
import {
  useLoginMutation,
  useResendLoginOtpMutation,
  useVerifyLoginOtpMutation,
} from "@/store/api/authApi";
import { setCredentials } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
    try {
      const response = await login(data).unwrap();
      setLoginEmail(data.email);
      setShowOtpModal(true);
      startTimer();
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.data?.message || "Login failed");
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      const response = await verifyOtp({
        email: loginEmail,
        otp: otpCode,
      }).unwrap();

      if (response.user && response.access_token) {
        dispatch(
          setCredentials({
            user: response.user,
            accessToken: response.access_token,
          }),
        );
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Invalid OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: loginEmail }).unwrap();
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
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-navy">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1">আপনার একাউন্টে লগইন করুন</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none transition-colors"
              placeholder="example@school.edu"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-end mb-5">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-navy-light hover:underline"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoginLoading}
          className="w-full py-3.5 bg-navy text-white font-semibold rounded-lg hover:bg-navy-mid transition-colors disabled:opacity-50"
        >
          {isLoginLoading ? "Sending OTP..." : "Login করুন →"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          একাউন্ট নেই?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-navy-light font-medium hover:underline"
          >
            Register করুন
          </button>
        </p>
      </form>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-navy">OTP যাচাই করুন</h3>
              <p className="text-gray-500 text-sm mt-1">
                {loginEmail} এ ৬ সংখ্যার কোড পাঠানো হয়েছে
              </p>
            </div>

            <div className="flex gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="flex-1 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:border-amber outline-none"
                />
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mb-4">
              কোড পাননি?{" "}
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  disabled={isResendLoading}
                  className="text-amber font-semibold hover:underline disabled:opacity-50"
                >
                  {isResendLoading ? "Sending..." : "আবার পাঠান"}
                </button>
              ) : (
                <span className="text-amber font-semibold">
                  00:{timer.toString().padStart(2, "0")}
                </span>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={isVerifyLoading}
                className="flex-1 py-2.5 bg-amber text-navy font-semibold rounded-lg hover:bg-amber-light disabled:opacity-50"
              >
                {isVerifyLoading ? "Verifying..." : "Verify & Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
