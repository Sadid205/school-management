// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/accounts/auth/login",
    LOGIN_OTP_VERIFY: "/accounts/auth/login/otp/verify",
    RESEND_LOGIN_OTP: "/accounts/auth/login/resend/otp",
    REGISTER: "/accounts/auth/register",
    REGISTER_OTP_VERIFY: "/accounts/auth/register/otp/verify",
    RESEND_OTP: "/accounts/auth/resend/otp",
    FORGOT_PASSWORD: "/accounts/auth/password/reset",
    RESET_PASSWORD: "/accounts/auth/password/reset/otp/verify",
    LOGOUT: "/accounts/auth/logout",
    PROFILE: "/accounts/profile",
  },
  STUDENTS: "/students",
  TEACHERS: "/teachers",
  ATTENDANCE: "/attendance",
  COURSES: "/courses",
  EXAMS: "/exams",
  RESULTS: "/results",
  PURCHASES: "/purchases",
};

// User Roles
export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  PARENT: "parent",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  LEAVE: "leave",
} as const;

// Exam Types
export const EXAM_TYPES = {
  MIDTERM: "midterm",
  FINAL: "final",
  ASSIGNMENT: "assignment",
  QUIZ: "quiz",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
} as const;
