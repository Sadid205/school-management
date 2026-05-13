import { baseApi } from "./baseApi";

// Types for auth API
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message?: string;
  // After OTP verification, you'll get user data
  user?: User;
  access_token?: string;
}

interface RegisterRequest {
  username: string;
  first_name: string;
  last_name: string;
  role: "student" | "teacher" | "parent" | "admin";
  email: string;
  password1: string;
  password2: string;
}

interface ResendOtpRequest {
  email: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Step 1: Login - sends OTP to email
    login: builder.mutation<{ message: string }, LoginRequest>({
      query: (credentials) => ({
        url: "/accounts/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Step 2: Verify Login OTP
    verifyLoginOtp: builder.mutation<LoginResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/accounts/auth/login/otp/verify",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Handle successful OTP verification
          if (data.user && data.access_token) {
            // You can dispatch setCredentials here or handle in component
          }
        } catch (error) {
          console.error("OTP verification failed:", error);
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // Resend Login OTP
    resendLoginOtp: builder.mutation<{ message: string }, ResendOtpRequest>({
      query: (data) => ({
        url: "/accounts/auth/login/resend/otp",
        method: "POST",
        body: data,
      }),
    }),

    // Register new user (sends OTP)
    register: builder.mutation<{ message: string }, RegisterRequest>({
      query: (userData) => ({
        url: "/accounts/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Verify Register OTP
    verifyRegisterOtp: builder.mutation<LoginResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/accounts/auth/register/otp/verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Resend OTP (for registration)
    resendOtp: builder.mutation<{ message: string }, ResendOtpRequest>({
      query: (data) => ({
        url: "/accounts/auth/resend/otp",
        method: "POST",
        body: data,
      }),
    }),

    // Forgot Password - send OTP
    forgotPassword: builder.mutation<
      { message: string },
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/accounts/auth/password/reset",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password with OTP
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (data) => ({
        url: "/accounts/auth/password/reset/otp/verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Logout
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/accounts/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear all cached data on logout
          dispatch(baseApi.util.resetApiState());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // Get current user profile
    getCurrentUser: builder.query<User, void>({
      query: () => "/accounts/profile",
      providesTags: ["User"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useVerifyLoginOtpMutation,
  useResendLoginOtpMutation,
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
