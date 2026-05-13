import {
    createApi,
    fetchBaseQuery,
    RetryOptions,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../index";

// Custom retry configuration
const retryOptions: RetryOptions = {
  maxRetries: 3,
};

// Base query with authentication and error handling
const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  credentials: "include", // For cookies (sessionid)
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    // Add Authorization header if token exists
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Add Content-Type header
    headers.set("Content-Type", "application/json");

    return headers;
  },
  ...retryOptions,
});

// Custom base query with retry and error handling
const baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized - Token expired
  if (result.error?.status === 401) {
    // You can add refresh token logic here
    console.error("Authentication failed. Please login again.");
  }

  // Handle 403 Forbidden
  if (result.error?.status === 403) {
    console.error("You do not have permission to access this resource.");
  }

  // Handle 500 Server Error
  if (result.error?.status === 500) {
    console.error("Server error. Please try again later.");
  }

  return result;
};

// Create base API instance
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    "Auth",
    "User",
    "Student",
    "Teacher",
    "Attendance",
    "Course",
    "Exam",
    "Result",
    "Purchase",
    "Inventory",
  ],
  endpoints: () => ({}),
  keepUnusedDataFor: 60, // Keep unused data for 60 seconds
  refetchOnMountOrArgChange: true, // Refetch when component mounts
  refetchOnFocus: true, // Refetch when window gets focus
  refetchOnReconnect: true, // Refetch when reconnecting
});
