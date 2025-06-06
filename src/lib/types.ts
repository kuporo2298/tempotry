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
  status?: "pending" | "approved" | "rejected" | "revision";
  comments?: string;
  revisionRequests?: string[];
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  createdBy?: string;
  reviewedBy?: string;
  notificationRead?: boolean;
}

export type UserRole = "teacher" | "dean";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SignupRequest {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}
