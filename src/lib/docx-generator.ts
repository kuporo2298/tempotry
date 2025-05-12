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
        properties: {},
        children: [
          // Header
          new Paragraph({
            text: "UNIVERSITY OF LA SALETTE",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "COURSE LEARNING PLAN",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          // Course Information
          new Paragraph({
            text: "COURSE INFORMATION",
            heading: HeadingLevel.HEADING_3,
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
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph("Course Title:")],
                  }),
                  new TableCell({
                    width: {
                      size: 70,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph(coursePlan.subject)],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Course Code:")],
                  }),
                  new TableCell({
                    children: [new Paragraph(coursePlan.courseCode || "")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Department:")],
                  }),
                  new TableCell({
                    children: [new Paragraph(coursePlan.department)],
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

          // Course Objectives
          new Paragraph({
            text: "COURSE OBJECTIVES",
            heading: HeadingLevel.HEADING_3,
          }),
          ...coursePlan.objectives.map(
            (objective) =>
              new Paragraph({
                bullet: {
                  level: 0,
                },
                text: objective,
              }),
          ),
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          // Course Topics
          new Paragraph({
            text: "COURSE TOPICS",
            heading: HeadingLevel.HEADING_3,
          }),
          ...coursePlan.topics.map(
            (topic) =>
              new Paragraph({
                bullet: {
                  level: 0,
                },
                text: topic,
              }),
          ),
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          // Assessment Methods
          new Paragraph({
            text: "ASSESSMENT METHODS",
            heading: HeadingLevel.HEADING_3,
          }),
          ...coursePlan.assessmentMethods.map(
            (method) =>
              new Paragraph({
                bullet: {
                  level: 0,
                },
                text: method,
              }),
          ),
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          // References
          new Paragraph({
            text: "REFERENCES",
            heading: HeadingLevel.HEADING_3,
          }),
          ...coursePlan.references.map(
            (reference) =>
              new Paragraph({
                bullet: {
                  level: 0,
                },
                text: reference,
              }),
          ),
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),

          // Course Schedule
          ...(coursePlan.schedule
            ? [
                new Paragraph({
                  text: "COURSE SCHEDULE",
                  heading: HeadingLevel.HEADING_3,
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
                          children: [new Paragraph("Week")],
                        }),
                        new TableCell({
                          children: [new Paragraph("Topic")],
                        }),
                        new TableCell({
                          children: [new Paragraph("Activities")],
                        }),
                      ],
                    }),
                    ...coursePlan.schedule.map(
                      (item) =>
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph(item.week.toString())],
                            }),
                            new TableCell({
                              children: [new Paragraph(item.topic)],
                            }),
                            new TableCell({
                              children: [new Paragraph(item.activities)],
                            }),
                          ],
                        }),
                    ),
                  ],
                }),
              ]
            : []),

          // Footer
          new Paragraph({
            text: "",
            spacing: {
              after: 500,
            },
          }),
          new Paragraph({
            text: "Generated by University of La Salette AI Course Plan Generator",
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),
          new Paragraph({
            text: new Date().toLocaleDateString(),
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });

  // Generate and save document
  const buffer = await Packer.toBlob(doc);
  FileSaver.saveAs(buffer, `${coursePlan.subject} - Course Plan.docx`);
}
