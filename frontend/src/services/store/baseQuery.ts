import { envVars } from "@/config/env";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// export const rawBaseQuery = (
//   baseUrl: string,
//   credentials: "include" | undefined,
//   extraOptions: any,
// ) =>
//   fetchBaseQuery({
//     baseUrl,
//     credentials,
//     ...extraOptions,
//   });

export const rawBaseQuery = fetchBaseQuery({
  baseUrl: envVars.NEXT_PUBLIC_API_URL,
  credentials: "include",
});
