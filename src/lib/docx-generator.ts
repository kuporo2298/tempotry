import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
} from "docx";
import FileSaver from "file-saver";

interface CoursePlan {
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
}

// Helper function to generate AI content for placeholders
function generateAIContent(type: string, context: any = {}): string | string[] {
  switch (type) {
    case "courseNumber":
      return context.courseCode || "PBSIT 001";
    case "descriptiveTitle":
      return context.subject || "Introduction to Human Computer Interaction";
    case "units":
      return "3 units (2 units Lecture/ 1 unit Laboratory)";
    case "contactHours":
      return "5 hours per week (2 hours Lecture/ 3 hours Laboratory)";
    case "courseType":
      return "Lecture / Laboratory";
    case "courseDescription":
      return `This course provides concepts, theory and practice to the field of ${context.subject?.toLowerCase() || "the subject"}. The course covers basic components of ${context.subject?.toLowerCase() || "the subject"}; interdisciplinary underpinnings; informed and critical evaluation of computer-based technology; user-oriented perspective, rather than system-oriented, with two thrusts: human (cognitive, social) and technological (input/output, interactions styles, devices); and design guidelines, evaluation methods, participatory design, communication between users and system developers. Students at the end of the course will have learned some useful techniques and an understanding of systematic procedures for creating usable and useful designs and systems.`;
    case "programOutcomeRelation":
      // Generate X or ✓ for program outcome relations
      return Math.random() > 0.5 ? "✓" : "";
    case "learningOutcome":
      if (context.objective) {
        return `LO${context.index + 1} ${context.objective}`;
      }
      return "Understand and apply key concepts related to the subject matter";
    case "weeklyLearningOutcome":
      return `At the end of the week, students will be able to understand and apply concepts related to ${context.topic || "the subject matter"}.`;
    case "weeklyTopicOutline":
      return context.topic || "Introduction to the subject";
    case "weeklyMethodology":
      return "Lecture, Discussion, Hands-on Activities, Group Work";
    case "weeklyAssessment":
      return "Quizzes, Laboratory Activities, Assignments, Group Presentations";
    case "weeklyResources":
      return "Slides/Module, Textbooks, Online resources, Case Studies";
    case "courseObjectives":
      if (context.objectives && Array.isArray(context.objectives)) {
        return context.objectives;
      }
      return [
        "Analyze different user populations with regard to their abilities and characteristics",
        "Evaluate the design of existing user interfaces based on cognitive models",
        "Apply design principles to create effective user interfaces",
        "Conduct usability testing and evaluate results",
        "Implement user-centered design methodologies in software development",
      ];
    case "references":
      if (context.references && Array.isArray(context.references)) {
        return context.references;
      }
      return [
        "Introduction to Human-Computer Interaction by Alan Dix, Janet Finlay, Gregory Abowd, and Russell Beale",
        "Don't Make Me Think by Steve Krug",
        "The Design of Everyday Things by Don Norman",
        "Human-Computer Interaction: An Empirical Research Perspective by Scott MacKenzie",
        "Interaction Design: Beyond Human-Computer Interaction by Jenny Preece, Helen Sharp, and Yvonne Rogers",
      ];
    default:
      return "";
  }
}

export async function generateDocx(coursePlan: CoursePlan) {
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: [
          // Title Section
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),
          new Paragraph({
            text: "UNIVERSITY OF LA SALETTE, INC.",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({
            text: "Santiago City, Isabela, Philippines",
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),
          new Paragraph({
            text: "COLLEGE OF INFORMATION TECHNOLOGY",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
          }),
          new Paragraph({
            text: "COURSE LEARNING PLAN",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({
            text: "Second Semester, Academic Year 2024-2025",
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
          }),

          // Course Information
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Course Number")],
                  }),
                  new TableCell({
                    width: {
                      size: 5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph(":")],
                  }),
                  new TableCell({
                    width: {
                      size: 65,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [
                      new Paragraph(
                        generateAIContent("courseNumber", {
                          courseCode: coursePlan.courseCode,
                        }) as string,
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Descriptive Title")],
                  }),
                  new TableCell({
                    children: [new Paragraph(":")],
                  }),
                  new TableCell({
                    children: [new Paragraph(coursePlan.subject)],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Units")],
                  }),
                  new TableCell({
                    children: [new Paragraph(":")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(generateAIContent("units") as string),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Contact Hours per Week")],
                  }),
                  new TableCell({
                    children: [new Paragraph(":")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("contactHours") as string,
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Type of Course")],
                  }),
                  new TableCell({
                    children: [new Paragraph(":")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(generateAIContent("courseType") as string),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Signature Section
          new Paragraph({
            text: "",
            spacing: {
              after: 400,
            },
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Prepared and Submitted by:")],
                  }),
                  new TableCell({
                    width: {
                      size: 20,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Date Submitted:")],
                  }),
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Reviewed by:")],
                  }),
                  new TableCell({
                    width: {
                      size: 20,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Date Reviewed:")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "BIENVENIDO B. ABAD, JR, DIT",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph("_________________")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "BIENVENIDO B. ABAD, JR, DIT",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph("_________________")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "Instructor",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "Program Coordinator",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Endorsed by:")],
                  }),
                  new TableCell({
                    width: {
                      size: 70,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Date Endorsed:")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "RAMONSITO B. ADDUCUL, DIT",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph("_________________")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "Dean, College of Information Technology",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "Approved by:",
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "MADEILYN B. ESTACIO, Ph.D.",
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "Vice President for Academic Affairs",
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
          }),

          // Page break for next section
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

          // Vision, Mission, Core Values
          new Paragraph({
            text: "VISION",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: 'The University of La Salette, Inc., a Catholic institution founded by the Missionaries of Our Lady of La Salette, forms RECONCILERS "so that they may have life, and have it to the full." (John 10:10)',
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 300,
            },
          }),

          new Paragraph({
            text: "MISSION",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "The University of La Salette, Inc. is a premier institution of choice, providing accessible, quality, and transformative education for integral human development particularly the poor.",
            spacing: {
              after: 300,
            },
          }),

          new Paragraph({
            text: "CORE VALUES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "1. FAITH-The total submission to God's call to Holiness to His will",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "2. RECONCILIATION-Constantly renewing our relationship with God, others and all creation through a life of prayer, penance and zeal",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "3. INTEGRITY-The courage and determination to live and to die for Salettinian ideals",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "4. EXCELLENCE – Upholding the highest standard of quality education and professionalism in the areas of instruction, research and extension",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "5. SOLIDARITY – Commitment to building a community anchored on mutual trust, confidence, teamwork, unity and respect for the dignity of the human person and creation",
            spacing: {
              after: 300,
            },
          }),

          new Paragraph({
            text: "CORE COMPETENCIES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "• Researched-Based Oriented Learning",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• ICT-Integrated Learning",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Industry-Based Oriented Learning",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Oriented Toward Transformative Learning",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Oriented Toward Integrative Learning",
            spacing: {
              after: 400,
            },
          }),

          // Page break for next section
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

          // Institutional Objectives
          new Paragraph({
            text: "INSTITUTIONAL OBJECTIVES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "In keeping with its Philosophy, Vision and Mission, La Salette professes the following institutional objectives:",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "1. To foster a reconciled and reconciling community through spiritual upliftment programs and liturgical activities.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "2. To sustain the quality assured education of the university through institutional and program accreditations, professional certification, and compliance with international standards for curricular programs and university management.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "3. To provide accessible education through various modalities of learning.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "4. To lead the academic community with strategic and transformative competencies in realizing the Vision, Mission and La Salette Philosophy of Education.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "5. To develop and implement transformative teaching and learning experience through critical approach and values-based integration.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "6. To undertake research on various disciplines and generate new knowledge needed for the advancement of the university as well as for the national development.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "7. To realize ICT oriented learning by establishing the monitoring system to collect and review information needed to manage an organization or on-going activities of the university.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "8. To provide industry experience through on-the-job-trainings, exposures, internship, immersion programs and linkages.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "9. To provide a holistic curriculum that integrates instruction, extension, research, ICT, industry experience for both students and faculty.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "10. To adopt an interdisciplinary approach by enhancing the institution's interest in the understanding of the cultural reproduction and social integration and in spiritual and moral formation",
            spacing: {
              after: 300,
            },
          }),

          // Institutional Outcomes
          new Paragraph({
            text: "INSTITUTIONAL OUTCOMES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "Having finished their academic degree at the University of La Salette, the graduates are expected to become:",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "Transformative Leaders.  Active involvement in their respective community and organization by championing the Salettinian ideals.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "Reconcilers.  Continue to communicate their Salettinian identity and culture through active involvements in the evangelizing ministry of reconciliation in their local communities, work-places and in social organizations.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "Industry Competent.  Demonstrate their readiness in the arena of and qualification for employment through the established link between theoretical aspect of the curriculum and its practical dimension as a result of their on-the-job trainings, exposures, internship, immersion programs and linkages with relevant industries or workplaces.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "Research-Oriented.  Keep abreast with current developments and trends in all relevant technical/professional knowledge areas for successful adaptation to a changing and complex world through continuing engagement in research projects to contribute to the humanization of the world in general, and to the reconciling effects on their relationships with God, with fellow human beings, with society and with nature.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "Information and Communication Technology Proficient. Demonstrate contemporary skills applications as they offer innovative solutions in work situations through the employment of new technology and new ways of communication.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "Critical Thinkers.  Engage themselves in critical reflection and communicative discourses on uncritically assimilated assumptions, beliefs, value-system and diverse perspectives that need to be collaboratively addressed for an emancipatory and integral process of human growth and community building.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "Holistic Persons.  Demonstrate through their attitude, behavior and engagement a synthesis of faith and lived experience, of faith and science; synthesis of cognitive, affective and behavioral aspects of learning; synthesis of cultural and global concerns, and a synthesis of curricular and co-curricular programs.",
            spacing: {
              after: 300,
            },
          }),

          // Page break for next section
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

          // Program Outcomes
          new Paragraph({
            text: "PROGRAM OUTCOMES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "An IT graduate must acquire skill set that enables him or her to successfully perform integrative task including:",
            spacing: {
              after: 100,
            },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 15,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("CODE")],
                  }),
                  new TableCell({
                    width: {
                      size: 85,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("BSIT PROGRAM OUTCOMES")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT01")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Apply knowledge of computing, science and mathematics appropriate to the discipline",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT02")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Understand best practices and standards and their applications",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT03")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Analyze complex problems, and identify and define the computing requirements appropriate to its solution",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT04")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Identify and analyze user needs and take them into account in the selection, creation, evaluation and administration of computer-based systems",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT05")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Design, implement and evaluate computer-based systems, processes, components or programs to meet desired needs and requirements under various constraints",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT06")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Integrate IT-based solutions into the user environment effectively",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT07")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Apply knowledge through the use of current techniques, skills, tools and practices necessary for the IT profession",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT08")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Function effectively as a member or leader of a development team recognizing the different roles within a team to accomplish a common goal",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT09")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Assist in the creation of an effective IT project plan",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT10")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Communicate effectively with the computing community and with society at large about complex computing activities through logical writing, presentations and clear instructions",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT11")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Analyze the local and global impact of computing information technology on individuals, organizations and society",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT12")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Understand professional, ethical, legal, security and social issues and responsibilities in the utilization of information technology.",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("IT13")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Recognize the need for and engage in planning self-learning and improving performance as a foundation for continuing professional development",
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          // Program Outcomes and Institutional Outcomes Relationship
          new Paragraph({
            text: "PROGRAM OUTCOMES AND THEIR RELATIONSHIP TO THE INSTITUTIONAL OUTCOMES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          // Create the table for program outcomes and institutional outcomes
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 15,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("CODE")],
                  }),
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("BSIT PROGRAM OUTCOMES")],
                  }),
                  new TableCell({
                    width: {
                      size: 5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("T")],
                  }),
                  new TableCell({
                    width: {
                      size: 5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("R")],
                  }),
                  new TableCell({
                    width: {
                      size: 5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("I")],
                  }),
                  new TableCell({
                    width: {
                      size: 5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("R")],
                  }),
                  new TableCell({
                    width: {
                      size: 5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("I")],
                  }),
                  new TableCell({
                    width: {
                      size: 5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("C")],
                  }),
                  new TableCell({
                    width: {
                      size: 5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("H")],
                  }),
                ],
              }),
              // IT01 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT01")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Apply knowledge of computing, science and mathematics appropriate to the discipline",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT02 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT02")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Understand best practices and standards and their applications",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // Continue for IT03-IT13 with similar pattern
              // IT03 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT03")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Analyze complex problems, and identify and define the computing requirements appropriate to its solution",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT04 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT04")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Identify and analyze user needs and take them into account in the selection, creation, evaluation and administration of computer-based systems",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT05 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT05")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Design, implement and evaluate computer-based systems, processes, components or programs to meet desired needs and requirements under various constraints",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT06 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT06")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Integrate IT-based solutions into the user environment effectively",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT07 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT07")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Apply knowledge through the use of current techniques, skills, tools and practices necessary for the IT profession",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT08 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT08")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Function effectively as a member or leader of a development team recognizing the different roles within a team to accomplish a common goal",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT09 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT09")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Assist in the creation of an effective IT project plan",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT10 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT10")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Communicate effectively with the computing community and with society at large about complex computing activities through logical writing, presentations and clear instructions",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT11 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT11")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Analyze the local and global impact of computing information technology on individuals, organizations and society",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT12 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT12")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Understand professional, ethical, legal, security and social issues and responsibilities in the utilization of information technology.",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
              // IT13 row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("IT13")] }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Recognize the need for and engage in planning self-learning and improving performance as a foundation for continuing professional development",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("programOutcomeRelation") as string,
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Page break for next section
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

          // Course Information
          new Paragraph({
            text: "COURSE INFORMATION",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          // Course Information Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 20,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Course Code")],
                  }),
                  new TableCell({
                    width: {
                      size: 80,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [
                      new Paragraph(coursePlan.courseCode || "PBSIT 001"),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Course Title")],
                  }),
                  new TableCell({
                    children: [new Paragraph(coursePlan.subject)],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Course Description")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        generateAIContent("courseDescription", {
                          subject: coursePlan.subject,
                        }) as string,
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Pre-requisite")],
                  }),
                  new TableCell({
                    children: [new Paragraph("PCCBSIT 002")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Co-requisite")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Credit")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "3 units (2 units lecture/1 unit laboratory)",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Contact Hours Per Week")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "2 hours Lecture / 3 hours Laboratory per week",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Class Schedule")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "1A Lab 11:30am – 12:30pm MWF  / Lecture 8:00am – 9:00am TTh | 1B Lab 10:30am-12:00nn TTh/ Lecture 9:30-10:30 MW",
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Room Assignment")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "1A Lab ComLab 4, Lecture HD302 | 1B Lab ComLab 4, Lecture HD302",
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Course Outcomes
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "COURSE OUTCOMES AND THEIR RELATIONSHIP TO THE PROGRAM OUTCOMES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          // Course Outcomes Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("COURSE OUTCOMES")],
                  }),
                  ...Array(13)
                    .fill(0)
                    .map(
                      (_, i) =>
                        new TableCell({
                          width: {
                            size: 70 / 13,
                            type: WidthType.PERCENTAGE,
                          },
                          children: [
                            new Paragraph(
                              `IT${(i + 1).toString().padStart(2, "0")}`,
                            ),
                          ],
                        }),
                    ),
                ],
              }),
              // Generate course outcomes rows
              ...(coursePlan.objectives.length > 0
                ? coursePlan.objectives.map(
                    (objective, index) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph(
                                generateAIContent("learningOutcome", {
                                  objective,
                                  index,
                                }) as string,
                              ),
                            ],
                          }),
                          ...Array(13)
                            .fill(0)
                            .map(
                              () =>
                                new TableCell({
                                  children: [
                                    new Paragraph(
                                      generateAIContent(
                                        "programOutcomeRelation",
                                      ) as string,
                                    ),
                                  ],
                                }),
                            ),
                        ],
                      }),
                  )
                : (generateAIContent("courseObjectives") as string[]).map(
                    (objective, index) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph(
                                generateAIContent("learningOutcome", {
                                  objective,
                                  index,
                                }) as string,
                              ),
                            ],
                          }),
                          ...Array(13)
                            .fill(0)
                            .map(
                              () =>
                                new TableCell({
                                  children: [
                                    new Paragraph(
                                      generateAIContent(
                                        "programOutcomeRelation",
                                      ) as string,
                                    ),
                                  ],
                                }),
                            ),
                        ],
                      }),
                  )),
            ],
          }),

          // Page break for next section
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

          // Course Outline
          new Paragraph({
            text: "COURSE OUTLINE",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          // Course Outline Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 10,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("TIME FRAME")],
                  }),
                  new TableCell({
                    width: {
                      size: 25,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Learning Outcomes")],
                  }),
                  new TableCell({
                    width: {
                      size: 15,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Topic Outline")],
                  }),
                  new TableCell({
                    width: {
                      size: 15,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Methodology")],
                  }),
                  new TableCell({
                    width: {
                      size: 15,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Assessment")],
                  }),
                  new TableCell({
                    width: {
                      size: 20,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Learning Resources")],
                  }),
                ],
              }),
              // Generate weeks based on course plan schedule or topics if schedule is not available
              ...(
                coursePlan.schedule ||
                coursePlan.topics.map((topic, index) => ({
                  week: index + 1,
                  topic: topic,
                  activities: "Lecture, Discussion, Hands-on Activities",
                }))
              ).map(
                (week) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(`Week ${week.week}`)],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            generateAIContent("weeklyLearningOutcome", {
                              topic: week.topic,
                            }) as string,
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            generateAIContent("weeklyTopicOutline", {
                              topic: week.topic,
                            }) as string,
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            generateAIContent("weeklyMethodology") as string,
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            generateAIContent("weeklyAssessment") as string,
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            generateAIContent("weeklyResources") as string,
                          ),
                        ],
                      }),
                    ],
                  }),
              ),
            ],
          }),

          // Course Requirements
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "COURSE REQUIREMENTS",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "1. Examinations (Prelim, Midterm, Finals)",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "2. Module Activities",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "3. Quizzes",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "4. Completed Assessment Tasks",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "5. Submission of Completed Assignments",
            spacing: {
              after: 200,
            },
          }),

          // Grading System
          new Paragraph({
            text: "GRADING SYSTEM",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "The student's grade is composed of:",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "a. Prelim Period",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Class Standing = 2/3 (Quizzes/ Assignments/ Recitations/ Seat Works/Laboratory exercises/ Requirements)",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Examination = 1/3",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Prelim Grade = CS + PE",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "b. Midterm Period",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Class Standing = 2/3 (Quizzes/ Assignments/ Recitations/ Seat Works/Laboratory exercises/ Requirements)",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Examination = 1/3",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Midterm Grade = CS + ME",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Cumulative Midterm Grade = 2/3 of Midterm Grade + 1/3 of Prelim Grade",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "c. Final Period",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Class Standing = 2/3 (Quizzes/ Assignments/ Recitations/ Seat Works/Laboratory exercises/ Requirements)",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Examination = 1/3",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Final Grade = CS + FE",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "• Cumulative Final Grade = 2/3 of Final Grade + 1/3 of Cumulative Midterm Grade",
            spacing: {
              after: 200,
            },
          }),

          // Page break for next section
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

          // Performance Assessment Rubrics
          new Paragraph({
            text: "PERFORMANCE ASSESSMENT RUBRICS",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          // Performance Assessment Rubrics Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 20,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Criteria")],
                  }),
                  new TableCell({
                    width: {
                      size: 16,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Exemplary\n4")],
                  }),
                  new TableCell({
                    width: {
                      size: 16,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Acceptable\n3")],
                  }),
                  new TableCell({
                    width: {
                      size: 16,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Developing\n2")],
                  }),
                  new TableCell({
                    width: {
                      size: 16,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Beginning\n1")],
                  }),
                  new TableCell({
                    width: {
                      size: 16,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Not done\n0")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Each criterion will be defined for specific assessment that will assess the respective course learning outcomes",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Work is equivalent to expected outcome in the workplace. Work is of exceptional quality and meets or exceeds all expectations.",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Work is close to expected quality outcome in the workplace but few errors or mistakes committed. Work demonstrates a clear understanding of the concepts and skills being assessed.",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Acceptable work. Many areas are properly done while many need rework. Work shows a basic understanding of the concepts and skills being assessed.",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Needs to study to achieve. Need to rework major areas. Work demonstrates a limited understanding of the concepts and skills being assessed.",
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Not done. There is no evidence of understanding of the concepts and skills being assessed.",
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "* Each attainment descriptor may be changed to suit the particular criterion.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "* This applies to both laboratory and lecture",
            spacing: {
              after: 200,
            },
          }),

          // Specific Course Policies
          new Paragraph({
            text: "SPECIFIC COURSE POLICIES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "According to the University of La Salette, Inc. Student Handbook Section 5.7",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "1. A class hour begins and ends with a prayer. Classroom prayer must be recited with decorum.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "2. Respect, orderly and decent behavior and conduct shall be observed inside the classroom at all times.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "3. A student may be allowed to leave the room with the permission of the instructor and/or authorized personnel of the university while the class is in session.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "4. Students who wish to sit-in class must secure permit from the instructor.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "5. Students are not allowed to stay inside the classroom if there are no classes.",
            spacing: {
              after: 100,
            },
          }),

          new Paragraph({
            text: "6. Students are not allowed to attend classes if not in proper uniform. It must be observed that PE uniform shall be utilized for PE classes only.",
            spacing: {
              after: 200,
            },
          }),

          // Page break for next section
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

          // Consultation Hours
          new Paragraph({
            text: "CONSULTATION HOURS",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          // Consultation Hours Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 20,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Day")],
                  }),
                  new TableCell({
                    width: {
                      size: 40,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Time")],
                  }),
                  new TableCell({
                    width: {
                      size: 40,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Venue")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Monday")] }),
                  new TableCell({
                    children: [new Paragraph("10:00 AM - 12:00 PM")],
                  }),
                  new TableCell({ children: [new Paragraph("Faculty Room")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Wednesday")] }),
                  new TableCell({
                    children: [new Paragraph("1:00 PM - 3:00 PM")],
                  }),
                  new TableCell({ children: [new Paragraph("Faculty Room")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Friday")] }),
                  new TableCell({
                    children: [new Paragraph("10:00 AM - 12:00 PM")],
                  }),
                  new TableCell({ children: [new Paragraph("Faculty Room")] }),
                ],
              }),
            ],
          }),

          // References
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "REFERENCES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          ...(coursePlan.references.length > 0
            ? coursePlan.references.map(
                (reference) =>
                  new Paragraph({
                    bullet: {
                      level: 0,
                    },
                    text: reference,
                    spacing: {
                      after: 100,
                    },
                  }),
              )
            : (generateAIContent("references") as string[]).map(
                (reference) =>
                  new Paragraph({
                    bullet: {
                      level: 0,
                    },
                    text: reference,
                    spacing: {
                      after: 100,
                    },
                  }),
              )),

          // Revision and Approval Notation
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          new Paragraph({
            text: "REVISION AND APPROVAL NOTATION:",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 200,
            },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 25,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph(" ")],
                  }),
                  new TableCell({
                    width: {
                      size: 25,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("NAME")],
                  }),
                  new TableCell({
                    width: {
                      size: 25,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("POSITION/DESIGNATION")],
                  }),
                  new TableCell({
                    width: {
                      size: 12.5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("SIGNATURE")],
                  }),
                  new TableCell({
                    width: {
                      size: 12.5,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("DATE")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Last Revised by")],
                  }),
                  new TableCell({
                    children: [new Paragraph("BIENVENIDO B. ABAD, JR., DIT")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Teaching Staff")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Last Updated by")],
                  }),
                  new TableCell({
                    children: [new Paragraph("BIENVENIDO B. ABAD, JR., DIT")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Program Coordinator")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Reviewed by")],
                  }),
                  new TableCell({
                    children: [new Paragraph("BIENVENIDO B. ABAD, JR., DIT")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Program Coordinator")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Endorsed by")],
                  }),
                  new TableCell({
                    children: [new Paragraph("RAMONSITO B. ADDUCUL, DIT")],
                  }),
                  new TableCell({
                    children: [new Paragraph("College Dean")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Approved by")],
                  }),
                  new TableCell({
                    children: [new Paragraph("MADEILYN B. ESTACIO, Ph.D.")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Vice President for Academic Affairs"),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                  new TableCell({
                    children: [new Paragraph("")],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Generate and save document
  const buffer = await Packer.toBlob(doc);
  FileSaver.saveAs(buffer, `${coursePlan.subject} - Course Learning Plan.docx`);
}
