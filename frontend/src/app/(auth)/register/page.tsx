"use client";

import {
  useRegisterMutation,
  useResendOtpMutation,
  useVerifyRegisterOtpMutation,
} from "@/services/store/api/auth-api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Role type define করুন
type RoleType = "student" | "teacher" | "parent" | "admin" | "super_admin";

interface RegisterForm {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password1: string;
  password2: string;
}

const roles: {
  value: RoleType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    value: "student",
    label: "Student",
    icon: "👨‍🎓",
    description: "Access to courses, attendance, results",
  },
  {
    value: "teacher",
    label: "Teacher",
    icon: "👨‍🏫",
    description: "Manage classes, marks, attendance",
  },
  {
    value: "parent",
    label: "Parent",
    icon: "👨‍👩‍👧",
    description: "Track child's progress",
  },
  {
    value: "admin",
    label: "Admin",
    icon: "🛡️",
    description: "Full system access",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  // ❌ dispatch দরকার নেই - কারণ setUser ব্যবহার করছি না
  const [selectedRole, setSelectedRole] = useState<RoleType>("student");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [registerEmail, setRegisterEmail] = useState("");
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerUser, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [verifyOtp, { isLoading: isVerifyLoading }] =
    useVerifyRegisterOtpMutation();
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>();

  const password = watch("password1");

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

  const onSubmit = async (data: RegisterForm) => {
    if (data.password1 !== data.password2) {
      setError("password2", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    toast.loading("Creating your account...", { id: "registering" });

    try {
      const response = await registerUser({
        ...data,
        role: selectedRole, // ✅ এখন Type safe
      }).unwrap();

      setRegisterEmail(data.email);
      setShowOtpModal(true);
      startTimer();
      toast.success("OTP sent to your email! Please verify.", {
        id: "registering",
      });
    } catch (error: any) {
      const errorsFromServer = error.data;
      if (errorsFromServer) {
        Object.entries(errorsFromServer).forEach(([field, messages]) => {
          setError(field as "username" | "email" | "password1" | "password2", {
            type: "server",
            message: Array.isArray(messages)
              ? messages[0]
              : (messages as string),
          });
        });
      }
      toast.error(
        error.data?.message || "Registration failed. Please check the form.",
        {
          id: "registering",
        },
      );
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
        email: registerEmail,
        otp: otpCode,
      }).unwrap();

      // ✅ শুধু রেজিস্টার কমপ্লিট - লগইন হয়নি, তাই setUser দরকার নেই
      // ✅ কুকি এখনও সেট হয়নি (লগইন করলেই সেট হবে)

      toast.success("Registration successful! Please login to continue.", {
        id: "verifying",
      });

      // ✅ লগইন পেজে পাঠিয়ে দিন
      router.push("/login");
    } catch (error: any) {
      toast.error(error.data?.message || "Invalid OTP. Please try again.", {
        id: "verifying",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: registerEmail }).unwrap();
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
      const nextInput = document.getElementById(`reg-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reg-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-2xl px-4 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-md bg-amber-pale">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-3xl font-bold text-navy">Create New Account</h1>
          <p className="mt-2 text-gray-500">
            Join EduNest and manage your school smarter
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <label className="block mb-3 text-sm font-semibold text-gray-700">
            Select Your Role <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  selectedRole === role.value
                    ? "border-amber bg-amber-pale shadow-md"
                    : "border-gray-200 bg-white hover:border-amber hover:bg-amber-pale/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{role.icon}</span>
                  <span className="font-semibold text-navy">{role.label}</span>
                  {selectedRole === role.value && (
                    <CheckCircle size={18} className="ml-auto text-amber" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{role.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                  />
                  <input
                    type="text"
                    {...register("first_name", {
                      required: "First name is required",
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.first_name
                        ? "border-red-500 focus:ring-red-200 bg-red-50"
                        : "border-gray-200 focus:border-navy-light focus:ring-navy-light/20"
                    }`}
                    placeholder="Ahmed"
                  />
                </div>
                {errors.first_name && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.first_name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                  />
                  <input
                    type="text"
                    {...register("last_name", {
                      required: "Last name is required",
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.last_name
                        ? "border-red-500 focus:ring-red-200 bg-red-50"
                        : "border-gray-200 focus:border-navy-light focus:ring-navy-light/20"
                    }`}
                    placeholder="Rahman"
                  />
                </div>
                {errors.last_name && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AtSign
                  size={18}
                  className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-500 focus:ring-red-200 bg-red-50"
                      : "border-gray-200 focus:border-navy-light focus:ring-navy-light/20"
                  }`}
                  placeholder="ahmed.rahman"
                />
              </div>
              {errors.username && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                  <AlertCircle size={12} /> {errors.username.message}
                </p>
              )}
            </div>

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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
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

            <div className="grid grid-cols-2 gap-4">
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
                    {...register("password1", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-navy-light focus:ring-navy-light/20"
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
                {errors.password1 && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.password1.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("password2", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-navy-light focus:ring-navy-light/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.password2 && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.password2.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegisterLoading}
              className="flex items-center justify-center w-full gap-2 py-3 mt-4 font-semibold text-white transition-all rounded-lg bg-navy hover:bg-navy-mid disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegisterLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="pt-2 text-sm text-center text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold text-navy-light hover:underline"
              >
                Sign In Instead
              </button>
            </p>
          </form>
        </div>

        {/* Footer Copyright */}
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
                <span className="font-medium text-navy">{registerEmail}</span>
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`reg-otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-xl font-bold text-center border-2 border-gray-200 rounded-lg focus:border-amber focus:outline-none"
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
                  "Verify & Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
