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
                      new Paragraph(coursePlan.courseCode || "PBSIT 001"),
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
                      new Paragraph(
                        "3 units (2 units Lecture/ 1 unit Laboratory)",
                      ),
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
                        "5 hours per week (2 hours Lecture/ 3 hours Laboratory)",
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
                    children: [new Paragraph("Lecture / Laboratory")],
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

          // Add more institutional objectives...

          // Course Outcomes
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

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
                        `This course provides concepts, theory and practice to the field of ${coursePlan.subject.toLowerCase()}. The course covers basic components of ${coursePlan.subject.toLowerCase()}; interdisciplinary underpinnings; informed and critical evaluation of computer-based technology; user-oriented perspective, rather than system-oriented, with two thrusts: human (cognitive, social) and technological (input/output, interactions styles, devices); and design guidelines, evaluation methods, participatory design, communication between users and system developers. Students at the end of the course will have learned some useful techniques and an understanding of systematic procedures for creating usable and useful designs and systems.`,
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
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("COURSE OUTCOMES")],
                  }),
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("PROGRAM OUTCOMES")],
                  }),
                ],
              }),
              ...coursePlan.objectives.map(
                (objective, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph(`LO${index + 1} ${objective}`),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            "IT01 IT02 IT03 IT04 IT05 IT06 IT07 IT08 IT09 IT10 IT11 IT12 IT13",
                          ),
                        ],
                      }),
                    ],
                  }),
              ),
            ],
          }),

          // Course Outline
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

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
                            `At the end of the week, students should have the ability to understand and apply concepts related to ${week.topic.toLowerCase()}.`,
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [new Paragraph(week.topic)],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            week.activities ||
                              "Lecture, Discussion, Hands-on Activities",
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            `• Quizzes\n• Laboratory Activities\n• Assignments`,
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            `• Slides/Module\n• Textbooks\n• Online resources`,
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

          // References
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: "REFERENCES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          ...coursePlan.references.map(
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
          ),

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
