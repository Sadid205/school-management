interface EnvConfig {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_DOMAIN_URL: string;
  NEXT_PUBLIC_BACKEND_URL: string;
}

export const envVars: EnvConfig = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL as string,
  NEXT_PUBLIC_DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL as string,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
};
