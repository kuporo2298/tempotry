import { CoursePlan, User } from "./types";

// Mock user data
export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@lasalette.edu",
  role: "teacher",
};

// Mock course plans data
export const mockCoursePlans: CoursePlan[] = [
  {
    id: "course-1",
    subject: "Introduction to Computer Science",
    department: "Computer Science",
    courseCode: "CS101",
    objectives: [
      "Understand fundamental computing concepts and principles",
      "Develop basic programming skills using a high-level language",
      "Apply computational thinking to solve problems",
      "Analyze algorithms and data structures for efficiency",
    ],
    topics: [
      "Computer Systems and Architecture",
      "Programming Fundamentals",
      "Data Structures and Algorithms",
      "Software Development Lifecycle",
      "Introduction to Databases",
    ],
    assessmentMethods: [
      "Written Examinations (40%)",
      "Programming Projects (30%)",
      "Laboratory Exercises (20%)",
      "Class Participation (10%)",
    ],
    references: [
      "Introduction to Computer Science: A Comprehensive Approach, 3rd Edition",
      "Programming Logic and Design, 9th Edition",
      "Data Structures and Algorithm Analysis in Java",
    ],
    schedule: [
      {
        week: 1,
        topic: "Course Introduction and Overview",
        activities: "Lecture, Group Discussion",
      },
      {
        week: 2,
        topic: "Computer Systems Architecture",
        activities: "Lecture, Lab Exercise",
      },
    ],
    status: "pending",
    createdAt: "2023-10-15T10:30:00Z",
    updatedAt: "2023-10-15T10:30:00Z",
    version: 1,
    createdBy: "user-1",
  },
  {
    id: "course-2",
    subject: "Database Management Systems",
    department: "Computer Science",
    courseCode: "CS202",
    objectives: [
      "Understand database design principles",
      "Master SQL for data manipulation and querying",
      "Implement database systems using modern DBMS",
      "Apply normalization techniques to optimize database structure",
    ],
    topics: [
      "Relational Database Model",
      "SQL Programming",
      "Database Design and Normalization",
      "Transaction Processing",
      "Database Security",
    ],
    assessmentMethods: [
      "Written Examinations (35%)",
      "Database Projects (40%)",
      "Lab Assignments (15%)",
      "Class Participation (10%)",
    ],
    references: [
      "Database Systems: The Complete Book, 2nd Edition",
      "SQL: The Complete Reference, 3rd Edition",
      "Fundamentals of Database Systems, 7th Edition",
    ],
    status: "approved",
    comments:
      "Well-structured course plan with comprehensive coverage of database concepts.",
    createdAt: "2023-09-20T14:15:00Z",
    updatedAt: "2023-09-22T09:45:00Z",
    version: 1,
    createdBy: "user-1",
  },
  {
    id: "course-3",
    subject: "Web Development Fundamentals",
    department: "Computer Science",
    courseCode: "CS150",
    objectives: [
      "Create responsive web pages using HTML5 and CSS3",
      "Implement client-side interactivity with JavaScript",
      "Develop server-side applications using a modern framework",
      "Deploy and maintain web applications",
    ],
    topics: [
      "HTML5 and CSS3 Fundamentals",
      "JavaScript Programming",
      "Responsive Web Design",
      "Server-Side Development",
      "Web Security Basics",
    ],
    assessmentMethods: [
      "Web Development Projects (50%)",
      "Coding Exercises (25%)",
      "Written Examinations (15%)",
      "Class Participation (10%)",
    ],
    references: [
      "HTML and CSS: Design and Build Websites",
      "JavaScript: The Definitive Guide",
      "Learning Web Design: A Beginner's Guide",
    ],
    status: "rejected",
    comments:
      "Please include more modern frameworks and tools in the curriculum. Consider adding sections on React, Angular, or Vue.js.",
    createdAt: "2023-10-05T11:20:00Z",
    updatedAt: "2023-10-07T16:30:00Z",
    version: 1,
    createdBy: "user-1",
  },
];
