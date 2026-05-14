"use client";

import {
  useResendLoginOtpMutation,
  useVerifyLoginOtpMutation,
} from "@/services/store/api/auth-api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Mail, RefreshCw } from "react-feather";
import toast from "react-hot-toast";

export default function OTPVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

    toast.loading("Verifying OTP...", { id: "verifying" });

    try {
      const response = await verifyOtp({ email, otp: otpCode }).unwrap();

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

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
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
  useEffect(() => {
    const otpCode = otp.join("");
    if (otpCode.length === 6 && !isVerifyLoading) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-md px-4 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-md bg-amber-pale">
            <Mail size={32} className="text-amber" />
          </div>
          <h1 className="text-3xl font-bold text-navy">Verify Your Email</h1>
          <p className="mt-2 text-gray-500">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-navy">{email}</span>
          </p>
        </div>

        {/* OTP Input Boxes */}
        <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex justify-center gap-3 mb-8">
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
                className="text-2xl font-bold text-center transition-all border-2 w-14 h-14 rounded-xl focus:outline-none focus:ring-2 focus:border-amber focus:ring-amber/20"
                style={{
                  borderColor: digit ? "#F5A623" : "#E5E7EB",
                  backgroundColor: digit ? "#FFF7E6" : "white",
                }}
              />
            ))}
          </div>

          {/* Resend Section */}
          <div className="mb-8 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={isResendLoading}
                  className="inline-flex items-center gap-1 font-semibold text-amber hover:underline disabled:opacity-50"
                >
                  {isResendLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Code"
                  )}
                </button>
              ) : (
                <span className="font-semibold text-amber">
                  Resend in 00:{timer.toString().padStart(2, "0")}
                </span>
              )}
            </p>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifyLoading}
            className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-all rounded-xl bg-navy hover:bg-navy-mid disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifyLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify & Login
                <CheckCircle size={18} />
              </>
            )}
          </button>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-navy"
            >
              <ArrowLeft size={14} />
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Copyright © 2024 EduNest. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
