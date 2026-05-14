export type UserRole =
  | "student"
  | "teacher"
  | "parent"
  | "admin"
  | "super_admin";

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile extends User {
  roll_number: string;
  class_level: number; // 6, 7, 8, 9, 10
  section: "A" | "B" | "C";
  group?: "Science" | "Arts" | "Commerce";
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  address: string;
}

export interface TeacherProfile extends User {
  employee_id: string;
  department: string;
  designation: string;
  qualification: string;
  joining_date: string;
}

export interface ParentProfile extends User {
  children: string[]; // Array of student IDs
  relationship: "Father" | "Mother" | "Guardian";
  occupation?: string;
}
