export interface CoursePlan {
  id?: string;
  subject: string;
  department: string;
  courseCode?: string;
  objectives: string[];
  topics: string[];
  assessmentMethods: string[];
  references: string[];
  schedule?: {
    week: number;
    topic: string;
    activities: string;
  }[];
  status?: "pending" | "approved" | "rejected";
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  createdBy?: string;
}

export type UserRole = "teacher" | "dean";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
