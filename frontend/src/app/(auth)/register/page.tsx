"use client";

import { useAppDispatch } from "@/hooks/redux-hooks";
import {
    useRegisterMutation,
    useResendOtpMutation,
    useVerifyRegisterOtpMutation,
} from "@/store/api/authApi";
import { setCredentials } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AtSign, Eye, EyeOff, Lock, Mail } from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface RegisterForm {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password1: string;
  password2: string;
}

const roles = [
  { value: "student", label: "Student", icon: "👨‍🎓" },
  { value: "teacher", label: "Teacher", icon: "👨‍🏫" },
  { value: "parent", label: "Parent", icon: "👨‍👩‍👧" },
  { value: "admin", label: "Admin", icon: "🛡️" },
];

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedRole, setSelectedRole] = useState("student");
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
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await registerUser({
        ...data,
        role: selectedRole,
      }).unwrap();

      setRegisterEmail(data.email);
      setShowOtpModal(true);
      startTimer();
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.data?.message || "Registration failed");
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
        email: registerEmail,
        otp: otpCode,
      }).unwrap();

      if (response.user && response.access_token) {
        dispatch(
          setCredentials({
            user: response.user,
            accessToken: response.access_token,
          }),
        );
        toast.success("Registration successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Invalid OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: registerEmail }).unwrap();
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
    <div>
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-navy">নতুন একাউন্ট</h1>
        <p className="text-gray-500 text-sm mt-1">আপনার রোল সিলেক্ট করুন</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => setSelectedRole(role.value)}
            className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
              selectedRole === role.value
                ? "border-navy bg-amber-pale"
                : "border-gray-300 hover:border-navy"
            }`}
          >
            <span className="text-lg">{role.icon}</span>
            <span className="text-sm font-medium text-navy">{role.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              {...register("first_name", {
                required: "First name is required",
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none"
              placeholder="আহমেদ"
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              {...register("last_name", { required: "Last name is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none"
              placeholder="রহমান"
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Username
          </label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none"
              placeholder="ahmed.rahman"
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none"
              placeholder="ahmed@school.edu"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password1", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none"
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
            {errors.password1 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password1.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("password2", {
                  required: "Please confirm password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-navy-light outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password2 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password2.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isRegisterLoading}
          className="w-full py-3.5 bg-navy text-white font-semibold rounded-lg hover:bg-navy-mid transition-colors disabled:opacity-50"
        >
          {isRegisterLoading ? "Creating account..." : "Register করুন →"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          আগেই একাউন্ট আছে?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-navy-light font-medium hover:underline"
          >
            Login করুন
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
                {registerEmail} এ ৬ সংখ্যার কোড পাঠানো হয়েছে
              </p>
            </div>

            <div className="flex gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`reg-otp-${index}`}
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
                {isVerifyLoading ? "Verifying..." : "Verify & Register"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
