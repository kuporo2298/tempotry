"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseInputForm from "@/components/CourseInputForm";
import CoursePlanPreview from "@/components/CoursePlanPreview";

export default function Home() {
  const [generatedPlan, setGeneratedPlan] = useState({}); // Initialize with empty object instead of null
  const [isGenerating, setIsGenerating] = useState(false);

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
        };

        setGeneratedPlan(mockGeneratedPlan);
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating course plan:", error);
      setIsGenerating(false);
    }
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
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          {/* Input Form Section */}
          <Card className="md:col-span-4 bg-card">
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

          {/* Preview Section */}
          <Card className="md:col-span-8 bg-card">
            <CardHeader>
              <CardTitle>Course Plan Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <CoursePlanPreview
                plan={generatedPlan}
                isLoading={isGenerating}
              />
            </CardContent>
          </Card>
        </div>

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
