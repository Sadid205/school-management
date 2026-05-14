// store/services/auth-api.ts
import { rawBaseQuery } from "@/services/store/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: rawBaseQuery,
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    // ============ LOGIN ============
    // 1. লগইন - OTP পাঠায়
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/accounts/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // 2. লগইন OTP ভেরিফাই
    verifyLoginOtp: builder.mutation({
      query: (data: { email: string; otp: string }) => ({
        url: "/accounts/auth/login/otp/verify",
        method: "POST",
        body: data,
      }),
    }),

    // 3. লগইন OTP রিসেন্ড
    resendLoginOtp: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/accounts/auth/login/resend/otp",
        method: "POST",
        body: data,
      }),
    }),

    // ============ REGISTER ============
    // 4. রেজিস্টার
    register: builder.mutation({
      query: (userData: {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        role: "student" | "teacher" | "parent" | "admin" | "super_admin";
        password1: string;
        password2: string;
      }) => ({
        url: "/accounts/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // 5. রেজিস্টার OTP ভেরিফাই
    verifyRegisterOtp: builder.mutation({
      query: (data: { email: string; otp: string }) => ({
        url: "/accounts/auth/register/otp/verify",
        method: "POST",
        body: data,
      }),
    }),

    // 6. রেজিস্টার OTP রিসেন্ড (জেনেরিক)
    resendOtp: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/accounts/auth/resend/otp",
        method: "POST",
        body: data,
      }),
    }),

    // ============ FORGOT PASSWORD ============
    // 7. ফরগট পাসওয়ার্ড - OTP পাঠায়
    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/accounts/auth/password/reset",
        method: "POST",
        body: data,
      }),
    }),

    // 8. ফরগট পাসওয়ার্ড OTP ভেরিফাই ও রিসেট
    resetPassword: builder.mutation({
      query: (data: { email: string; otp: string; new_password: string }) => ({
        url: "/accounts/auth/password/reset/otp/verify",
        method: "POST",
        body: data,
      }),
    }),

    // 9. ফরগট পাসওয়ার্ড OTP রিসেন্ড
    resendForgotPasswordOtp: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/accounts/auth/forgot-password/resend/otp",
        method: "POST",
        body: data,
      }),
    }),

    // ============ LOGOUT ============
    // 10. লগআউট
    logout: builder.mutation({
      query: () => ({
        url: "/accounts/auth/logout",
        method: "POST",
      }),
    }),

    // ============ CURRENT USER ============
    // 11. বর্তমান ইউজারের তথ্য (cookie থেকে)
    getCurrentUser: builder.query({
      query: () => "/accounts/profile",
      providesTags: ["User"],
    }),
  }),
});

// ============ EXPORT ALL HOOKS ============
export const {
  // Login hooks
  useLoginMutation,
  useVerifyLoginOtpMutation,
  useResendLoginOtpMutation,

  // Register hooks
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useResendOtpMutation,

  // Forgot password hooks
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendForgotPasswordOtpMutation,

  // Logout & User
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
