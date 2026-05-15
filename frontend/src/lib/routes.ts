export const ROUTES = {
  USER_PUBLIC: [
    "/signin",
    "/register",
    "/forgot-password",
    "/email-verification",
  ],
};

export const isUserPublicRoute = (pathname: string) =>
  ROUTES.USER_PUBLIC.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );

// "/store/forgot-password/email-verification"
