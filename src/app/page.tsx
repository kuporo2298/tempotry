"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseInputForm from "@/components/CourseInputForm";
import CoursePlanPreview from "@/components/CoursePlanPreview";
import CourseList from "@/components/CourseList";
import CourseUpload from "@/components/CourseUpload";
import { CoursePlan } from "@/lib/types";
import { mockCoursePlans, currentUser } from "@/lib/mock-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate");
  const [generatedPlan, setGeneratedPlan] = useState<CoursePlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coursePlans, setCoursePlans] = useState<CoursePlan[]>(mockCoursePlans);
  const [selectedCourse, setSelectedCourse] = useState<CoursePlan | null>(null);

  const handleGenerate = async (subject: string, department: string) => {
    setIsGenerating(true);

    // Simulate API call to generate course plan
    try {
      // In a real implementation, this would be an API call to your backend
      // that integrates with an LLM to generate the course plan
      setTimeout(() => {
        const mockGeneratedPlan = {
          subject,
          department,
          courseCode: `${department.substring(0, 3).toUpperCase()}101`,
          objectives: [
            "Understand key concepts and principles related to the subject",
            "Develop critical thinking and analytical skills in the field",
            "Apply theoretical knowledge to practical scenarios",
            "Demonstrate effective communication of subject-related ideas",
          ],
          topics: [
            "Introduction to the subject and its significance",
            "Historical development and theoretical foundations",
            "Core principles and methodologies",
            "Contemporary issues and applications",
            "Future trends and developments",
          ],
          assessmentMethods: [
            "Written examinations (40%)",
            "Research papers and assignments (30%)",
            "Class participation and discussions (15%)",
            "Group projects and presentations (15%)",
          ],
          references: [
            "Core textbooks relevant to the subject",
            "Academic journals and research papers",
            "Online resources and databases",
            "Case studies and practical examples",
          ],
          schedule: [
            {
              week: 1,
              topic: "Introduction to the course",
              activities: "Lecture, Group Discussion",
            },
            {
              week: 2,
              topic: "Fundamental concepts",
              activities: "Lecture, Case Studies",
            },
            {
              week: 3,
              topic: "Theoretical frameworks",
              activities: "Lecture, Group Activities",
            },
          ],
        };

        setGeneratedPlan(mockGeneratedPlan);
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating course plan:", error);
      setIsGenerating(false);
    }
  };

  const handleUploadPlan = (plan: CoursePlan) => {
    // In a real app, this would be an API call to save the plan to the database
    const newPlan = {
      ...plan,
      id: `course-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      createdBy: currentUser.id,
    };

    setCoursePlans([newPlan, ...coursePlans]);
    setActiveTab("my-courses");
  };

  const handleViewCourse = (course: CoursePlan) => {
    setSelectedCourse(course);
    setActiveTab("view-course");
  };

  const handleApproveCourse = (id: string, comments: string) => {
    setCoursePlans(
      coursePlans.map((course) =>
        course.id === id
          ? {
              ...course,
              status: "approved",
              comments,
              updatedAt: new Date().toISOString(),
            }
          : course,
      ),
    );
  };

  const handleRejectCourse = (id: string, comments: string) => {
    setCoursePlans(
      coursePlans.map((course) =>
        course.id === id
          ? {
              ...course,
              status: "rejected",
              comments,
              updatedAt: new Date().toISOString(),
            }
          : course,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">
                ULS
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">University of La Salette</h1>
              <p className="text-muted-foreground">
                AI-Powered Course Learning Plan Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-right">
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-muted-foreground capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="generate">Generate Plan</TabsTrigger>
            <TabsTrigger value="my-courses">My Course Plans</TabsTrigger>
            <TabsTrigger value="view-course">View Course</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-12">
              {/* Input Form Section */}
              <div className="md:col-span-4 space-y-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle>Generate Course Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CourseInputForm
                      onGenerate={handleGenerate}
                      isGenerating={isGenerating}
                    />
                  </CardContent>
                </Card>

                {generatedPlan && (
                  <CourseUpload
                    onUpload={handleUploadPlan}
                    currentPlan={generatedPlan}
                  />
                )}
              </div>

              {/* Preview Section */}
              <Card className="md:col-span-8 bg-card">
                <CardHeader>
                  <CardTitle>Course Plan Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <CoursePlanPreview
                    plan={generatedPlan || undefined}
                    isLoading={isGenerating}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="my-courses">
            <Card>
              <CardHeader>
                <CardTitle>My Course Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseList
                  courses={coursePlans}
                  userRole={currentUser.role}
                  onViewCourse={handleViewCourse}
                  onApproveCourse={handleApproveCourse}
                  onRejectCourse={handleRejectCourse}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view-course">
            {selectedCourse ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Course Plan Details</CardTitle>
                    <button
                      onClick={() => setActiveTab("my-courses")}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Back to List
                    </button>
                  </CardHeader>
                  <CardContent>
                    <CoursePlanPreview plan={selectedCourse} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-10 text-center">
                  <p className="text-muted-foreground">
                    Select a course plan to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} University of La Salette. All rights
            reserved.
          </p>
          <p className="mt-1">AI-Powered Course Learning Plan Generator</p>
        </footer>
      </div>
    </main>
  );
}
