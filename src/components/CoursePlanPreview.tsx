"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Download, Edit, Check, FileText } from "lucide-react";
import { generateDocx } from "@/lib/docx-generator";

interface CoursePlanPreviewProps {
  plan?: {
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
  };
  isLoading?: boolean;
  onExport?: () => void;
  onEdit?: (section: string) => void;
}

const CoursePlanPreview = ({
  plan = {
    subject: "Introduction to Computer Science",
    department: "Computer Studies",
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
      {
        week: 3,
        topic: "Programming Fundamentals I",
        activities: "Lecture, Coding Exercise",
      },
      {
        week: 4,
        topic: "Programming Fundamentals II",
        activities: "Lecture, Coding Project",
      },
    ],
  },
  isLoading = false,
  onExport = () => {},
  onEdit = (section) => console.log(`Editing section: ${section}`),
}: CoursePlanPreviewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleExportDocx = async () => {
    try {
      await generateDocx(plan);
    } catch (error) {
      console.error("Error generating DOCX:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-white border shadow-md">
        <CardContent className="p-10">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-lg font-medium text-slate-600">
              Generating course plan...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white border shadow-md">
      <CardHeader className="bg-slate-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Course Learning Plan Preview
          </CardTitle>
          <Button
            onClick={handleExportDocx}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export as DOCX
          </Button>
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-lg font-medium">{plan?.subject || ""}</p>
          <p className="text-sm text-slate-500">
            Department of {plan?.department || ""}
          </p>
          {plan?.courseCode && (
            <p className="text-sm text-slate-500">
              Course Code: {plan.courseCode}
            </p>
          )}
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-6">
          <TabsContent value="overview" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Course Overview</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit("overview")}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </div>
            <div className="bg-white border rounded-md p-6 space-y-4">
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-xl font-bold uppercase">
                  University of La Salette
                </h2>
                <h3 className="text-lg font-semibold">Course Learning Plan</h3>
              </div>

              <div className="border rounded-md p-4 bg-slate-50">
                <h4 className="font-semibold mb-2">Course Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Course Title:</div>
                  <div>{plan.subject}</div>

                  <div className="font-medium">Course Code:</div>
                  <div>{plan.courseCode || ""}</div>

                  <div className="font-medium">Department:</div>
                  <div>{plan.department}</div>
                </div>
              </div>

              <p className="text-slate-600 mt-4">
                This course provides a comprehensive introduction to{" "}
                {plan?.subject ? plan.subject.toLowerCase() : "this subject"},
                covering fundamental concepts, principles, and techniques.
                Students will develop a strong foundation in the subject matter
                and gain practical experience through various learning
                activities.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Course Objectives</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit("objectives")}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </div>
            <div className="bg-white border rounded-md p-6">
              <h4 className="font-semibold mb-4 uppercase text-center border-b pb-2">
                Course Objectives
              </h4>
              <p className="text-sm mb-4">
                Upon completion of this course, students will be able to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                {plan?.objectives?.map((objective, index) => (
                  <li key={index} className="text-slate-600">
                    {objective}
                  </li>
                )) || []}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Course Topics</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit("topics")}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </div>
            <div className="bg-white border rounded-md p-6">
              <h4 className="font-semibold mb-4 uppercase text-center border-b pb-2">
                Course Topics
              </h4>
              <p className="text-sm mb-4">
                This course covers the following topics:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                {plan?.topics?.map((topic, index) => (
                  <li key={index} className="text-slate-600">
                    {topic}
                  </li>
                )) || []}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Assessment Methods</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit("assessment")}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </div>
            <div className="bg-white border rounded-md p-6">
              <h4 className="font-semibold mb-4 uppercase text-center border-b pb-2">
                Assessment Methods
              </h4>
              <p className="text-sm mb-4">
                Student performance will be evaluated using the following
                methods:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                {plan?.assessmentMethods?.map((method, index) => (
                  <li key={index} className="text-slate-600">
                    {method}
                  </li>
                )) || []}
              </ul>

              <div className="mt-8">
                <h4 className="font-semibold mb-4 uppercase text-center border-b pb-2">
                  References
                </h4>
                <p className="text-sm mb-4">
                  The following resources are recommended for this course:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  {plan?.references?.map((reference, index) => (
                    <li key={index} className="text-slate-600">
                      {reference}
                    </li>
                  )) || []}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Course Schedule</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit("schedule")}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </div>
            <div className="bg-white border rounded-md p-6">
              <h4 className="font-semibold mb-4 uppercase text-center border-b pb-2">
                Course Schedule
              </h4>
              <p className="text-sm mb-4">Weekly topics and activities:</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r">
                        Week
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r">
                        Topic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Activities
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {plan.schedule?.map((item) => (
                      <tr key={item.week} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                          {item.week}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 border-r">
                          {item.topic}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.activities}
                        </td>
                      </tr>
                    )) || []}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="bg-slate-50 border-t p-4 flex justify-between">
        <div className="text-sm text-slate-500">
          <span className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-1" />
            AI-generated content ready for export
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="border-slate-300 hover:bg-slate-100"
          >
            <FileText className="mr-2 h-4 w-4" />
            Print Preview
          </Button>
          <Button
            onClick={handleExportDocx}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export as DOCX
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CoursePlanPreview;
