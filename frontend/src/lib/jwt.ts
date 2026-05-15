import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
  email: string;
  username: string;
  role: string;
}

// Token decode করো
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null): boolean {
  if (token === null) return false;
  const decoded = decodeToken(token as string);
  if (!decoded) return false;
  //

  const currentTime = Math.floor(Date.now() / 1000);
  //
  return decoded.exp > currentTime;
}
