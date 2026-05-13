"use client";

import { useAppDispatch } from "@/hooks/redux-hooks";
import {
    useResendLoginOtpMutation,
    useVerifyLoginOtpMutation,
} from "@/store/api/authApi";
import { setCredentials } from "@/store/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function OTPVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const [verifyOtp, { isLoading: isVerifyLoading }] =
    useVerifyLoginOtpMutation();
  const [resendOtp, { isLoading: isResendLoading }] =
    useResendLoginOtpMutation();

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
    startTimer();
  }, [email, router]);

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

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      const response = await verifyOtp({ email, otp: otpCode }).unwrap();
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

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
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
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center text-white text-xs">
          ✓
        </div>
        <div className="h-0.5 flex-1 bg-success" />
        <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">
          2
        </div>
        <div className="h-0.5 flex-1 bg-gray-200" />
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
          3
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-navy">OTP যাচাই করুন</h1>
        <p className="text-gray-500 text-sm mt-1">
          আপনার ইমেইলে ৬ সংখ্যার কোড পাঠানো হয়েছে
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
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

      <button
        onClick={handleVerify}
        disabled={isVerifyLoading}
        className="w-full py-3.5 bg-amber text-navy font-semibold rounded-lg hover:bg-amber-light transition-colors disabled:opacity-50"
      >
        {isVerifyLoading ? "Verifying..." : "যাচাই করুন ✓"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        <button
          onClick={() => router.push("/login")}
          className="text-navy-light hover:underline"
        >
          ← লগইন পেজে ফিরুন
        </button>
      </p>
    </div>
  );
}
