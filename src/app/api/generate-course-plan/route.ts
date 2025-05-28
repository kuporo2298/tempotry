import { NextResponse } from "next/server";
import { CoursePlan } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { subject, department } = await request.json();

    if (!subject || !department) {
      return NextResponse.json(
        { error: "Subject and department are required" },
        { status: 400 },
      );
    }

    // Create a prompt for the AI
    const prompt = `Generate a comprehensive course learning plan for a university course titled "${subject}" in the ${department} department. Include:
    1. Course objectives (4-6 learning outcomes)
    2. Main topics to be covered (5-8 topics)
    3. Assessment methods with percentage weightings
    4. Reference materials and resources
    5. Weekly schedule for at least 3 weeks with topics and activities
    
    Format the response as a JSON object with the following structure:
    {
      "objectives": ["objective 1", "objective 2", ...],
      "topics": ["topic 1", "topic 2", ...],
      "assessmentMethods": ["method 1 (percentage)", "method 2 (percentage)", ...],
      "references": ["reference 1", "reference 2", ...],
      "schedule": [{"week": 1, "topic": "topic", "activities": "activities"}, ...]
    }
    `;

    // In a production environment, you would call an actual AI API here
    // For now, we'll generate a more specific mock response based on the subject and department
    const courseCode = `${department.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 400) + 100}`;

    // Generate content based on subject and department
    const generatedPlan = generateSubjectSpecificPlan(
      subject,
      department,
      courseCode,
    );

    return NextResponse.json(generatedPlan);
  } catch (error) {
    console.error("Error generating course plan:", error);
    return NextResponse.json(
      { error: "Failed to generate course plan" },
      { status: 500 },
    );
  }
}

function generateSubjectSpecificPlan(
  subject: string,
  department: string,
  courseCode: string,
): CoursePlan {
  // Convert subject and department to lowercase for easier comparison
  const subjectLower = subject.toLowerCase();
  const departmentLower = department.toLowerCase();

  let objectives: string[] = [];
  let topics: string[] = [];
  let assessmentMethods: string[] = [];
  let references: string[] = [];
  let schedule: { week: number; topic: string; activities: string }[] = [];

  // Computer Science related courses
  if (
    departmentLower.includes("computer") ||
    departmentLower.includes("it") ||
    departmentLower.includes("information")
  ) {
    if (
      subjectLower.includes("programming") ||
      subjectLower.includes("coding")
    ) {
      objectives = [
        "Develop proficiency in writing efficient and maintainable code",
        "Apply problem-solving techniques to design algorithmic solutions",
        "Implement data structures appropriate for specific programming challenges",
        "Debug and test programs systematically to ensure reliability",
        "Collaborate effectively in team programming environments using version control",
      ];

      topics = [
        "Programming fundamentals and syntax",
        "Data types, variables, and control structures",
        "Functions, modules, and code organization",
        "Object-oriented programming concepts",
        "Data structures and algorithms",
        "Error handling and debugging techniques",
        "Testing and code quality assurance",
      ];

      assessmentMethods = [
        "Programming assignments and projects (40%)",
        "Coding examinations (30%)",
        "Algorithm design challenges (15%)",
        "Code review participation (15%)",
      ];

      references = [
        "Clean Code: A Handbook of Agile Software Craftsmanship by Robert C. Martin",
        "Introduction to Algorithms by Thomas H. Cormen et al.",
        "The Pragmatic Programmer by Andrew Hunt and David Thomas",
        "Online documentation and tutorials for relevant programming languages",
        "GitHub repositories of open-source projects for code study",
      ];
    } else if (
      subjectLower.includes("database") ||
      subjectLower.includes("data")
    ) {
      objectives = [
        "Design normalized database schemas that efficiently model real-world entities",
        "Implement and optimize SQL queries for data manipulation and retrieval",
        "Apply database security principles to protect sensitive information",
        "Develop database-driven applications using appropriate technologies",
        "Analyze and improve database performance through indexing and query optimization",
      ];

      topics = [
        "Relational database concepts and design",
        "SQL fundamentals for data definition and manipulation",
        "Normalization and denormalization techniques",
        "Transaction management and concurrency control",
        "Database security and access control",
        "NoSQL databases and their use cases",
        "Data warehousing and business intelligence",
      ];

      assessmentMethods = [
        "Database design projects (35%)",
        "SQL query assignments (25%)",
        "Database implementation case studies (20%)",
        "Performance optimization exercises (20%)",
      ];

      references = [
        "Database System Concepts by Abraham Silberschatz et al.",
        "SQL Performance Explained by Markus Winand",
        "NoSQL Distilled by Pramod J. Sadalage and Martin Fowler",
        "Database documentation for MySQL, PostgreSQL, MongoDB, etc.",
        "Academic papers on database optimization techniques",
      ];
    } else {
      // Generic Computer Science course
      objectives = [
        "Understand fundamental computing concepts and principles",
        "Apply computational thinking to solve complex problems",
        "Analyze algorithms and data structures for efficiency",
        "Design software systems using appropriate methodologies",
        "Evaluate emerging technologies and their potential impact",
      ];

      topics = [
        "Computer architecture and organization",
        "Operating systems and process management",
        "Data structures and algorithm analysis",
        "Software engineering principles",
        "Computer networks and communication",
        "Artificial intelligence and machine learning",
        "Ethical considerations in computing",
      ];

      assessmentMethods = [
        "Programming assignments (30%)",
        "Written examinations (30%)",
        "Research projects (25%)",
        "Class participation and discussions (15%)",
      ];

      references = [
        "Computer Science: An Overview by Glenn Brookshear",
        "Algorithms by Robert Sedgewick and Kevin Wayne",
        "Operating System Concepts by Abraham Silberschatz et al.",
        "Artificial Intelligence: A Modern Approach by Stuart Russell and Peter Norvig",
        "ACM and IEEE journals on computing",
      ];
    }
  }
  // Business related courses
  else if (
    departmentLower.includes("business") ||
    departmentLower.includes("management") ||
    departmentLower.includes("admin")
  ) {
    if (subjectLower.includes("marketing")) {
      objectives = [
        "Analyze consumer behavior and market trends to inform marketing strategies",
        "Develop integrated marketing campaigns across traditional and digital channels",
        "Apply marketing research methods to gather actionable insights",
        "Evaluate marketing performance using key metrics and analytics",
        "Create brand positioning strategies for competitive advantage",
      ];

      topics = [
        "Marketing fundamentals and the marketing mix",
        "Consumer behavior and market segmentation",
        "Digital marketing and social media strategies",
        "Brand management and positioning",
        "Marketing research and analytics",
        "Integrated marketing communications",
        "Global marketing and cultural considerations",
      ];

      assessmentMethods = [
        "Marketing plan development (35%)",
        "Case study analyses (25%)",
        "Market research project (20%)",
        "Campaign presentations (20%)",
      ];

      references = [
        "Marketing Management by Philip Kotler and Kevin Lane Keller",
        "Digital Marketing: Strategy, Implementation and Practice by Dave Chaffey",
        "Consumer Behavior by Leon G. Schiffman and Joseph L. Wisenblit",
        "Harvard Business Review case studies on marketing",
        "Journal of Marketing Research publications",
      ];
    } else {
      // Generic Business course
      objectives = [
        "Apply management theories to organizational challenges",
        "Analyze business environments and develop strategic responses",
        "Evaluate financial performance and make informed business decisions",
        "Demonstrate effective leadership and team management skills",
        "Understand ethical implications in business practices",
      ];

      topics = [
        "Management principles and organizational behavior",
        "Strategic planning and competitive analysis",
        "Financial management and accounting principles",
        "Marketing and customer relationship management",
        "Operations and supply chain management",
        "Business ethics and corporate social responsibility",
        "Global business and international trade",
      ];

      assessmentMethods = [
        "Case study analyses (30%)",
        "Business plan development (25%)",
        "Group presentations (20%)",
        "Written examinations (25%)",
      ];

      references = [
        "Management: Leading & Collaborating in a Competitive World by Thomas Bateman",
        "Strategic Management: Concepts and Cases by Fred David",
        "Financial Management: Theory and Practice by Eugene Brigham",
        "Harvard Business Review articles and case studies",
        "Journal of Business Ethics publications",
      ];
    }
  }
  // Education related courses
  else if (
    departmentLower.includes("education") ||
    departmentLower.includes("teaching")
  ) {
    objectives = [
      "Design effective learning experiences based on educational theories",
      "Apply appropriate assessment strategies to evaluate student learning",
      "Integrate technology to enhance teaching and learning processes",
      "Adapt instructional approaches for diverse learning needs",
      "Reflect critically on teaching practices for continuous improvement",
    ];

    topics = [
      "Learning theories and instructional design",
      "Curriculum development and planning",
      "Assessment and evaluation methods",
      "Classroom management strategies",
      "Educational technology integration",
      "Inclusive education and differentiated instruction",
      "Professional ethics in education",
    ];

    assessmentMethods = [
      "Lesson plan development (30%)",
      "Teaching demonstrations (25%)",
      "Research paper on educational practices (25%)",
      "Reflective teaching journal (20%)",
    ];

    references = [
      "Educational Psychology by Anita Woolfolk",
      "Curriculum: Foundations, Principles, and Issues by Allan C. Ornstein",
      "How People Learn by National Research Council",
      "Understanding by Design by Grant Wiggins and Jay McTighe",
      "Journal of Teacher Education publications",
    ];
  }
  // Default/generic course if no specific match
  else {
    objectives = [
      `Understand key concepts and principles related to ${subject}`,
      `Develop critical thinking and analytical skills in ${department}`,
      `Apply theoretical knowledge of ${subject} to practical scenarios`,
      `Evaluate current trends and developments in ${subject}`,
      `Communicate effectively about ${subject} using appropriate terminology`,
    ];

    topics = [
      `Introduction to ${subject} and its significance`,
      `Historical development and theoretical foundations of ${subject}`,
      `Core principles and methodologies in ${subject}`,
      `Contemporary issues and applications in ${subject}`,
      `Research methods in ${department} with focus on ${subject}`,
      `Professional and ethical considerations in ${subject}`,
      `Future trends and developments in ${subject}`,
    ];

    assessmentMethods = [
      "Written examinations (35%)",
      "Research papers and assignments (30%)",
      "Class participation and discussions (15%)",
      "Group projects and presentations (20%)",
    ];

    references = [
      `Core textbooks on ${subject}`,
      `Academic journals and research papers in ${department}`,
      `Case studies and practical examples related to ${subject}`,
      `Online resources and databases for ${subject}`,
      `Professional publications in the field of ${subject}`,
    ];
  }

  // Generate schedule based on topics
  schedule = topics.slice(0, Math.min(topics.length, 5)).map((topic, index) => {
    const activities = [
      "Lecture, Group Discussion",
      "Lecture, Case Studies",
      "Lecture, Hands-on Activities",
      "Lecture, Student Presentations",
      "Lecture, Problem-solving Workshop",
    ];

    return {
      week: index + 1,
      topic,
      activities: activities[index % activities.length],
    };
  });

  return {
    subject,
    department,
    courseCode,
    objectives,
    topics,
    assessmentMethods,
    references,
    schedule,
  };
}
