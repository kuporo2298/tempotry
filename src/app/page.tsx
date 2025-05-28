"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseInputForm from "@/components/CourseInputForm";
import CoursePlanPreview from "@/components/CoursePlanPreview";
import CourseList from "@/components/CourseList";
import CourseUpload from "@/components/CourseUpload";
import { CoursePlan } from "@/lib/types";
import { mockCoursePlans, currentUser } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("generate");
  const [generatedPlan, setGeneratedPlan] = useState<CoursePlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coursePlans, setCoursePlans] = useState<CoursePlan[]>(mockCoursePlans);
  const [selectedCourse, setSelectedCourse] = useState<CoursePlan | null>(null);
  const [latestFeedback, setLatestFeedback] = useState<CoursePlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      const userRole = localStorage.getItem("userRole");
      const userName = localStorage.getItem("userName");

      if (!authStatus || authStatus !== "true") {
        router.push("/login");
        return;
      }

      // If user is admin, redirect to admin page
      if (userRole === "admin") {
        router.push("/admin");
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the main content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Filter courses based on search term
  const filteredCoursePlans = coursePlans.filter(
    (course) =>
      course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.courseCode &&
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Effect to listen for course upload and selection events
  // Initialize from localStorage on component mount
  useEffect(() => {
    try {
      const storedPlans = JSON.parse(
        localStorage.getItem("coursePlans") || "[]",
      );
      if (storedPlans && storedPlans.length > 0) {
        setCoursePlans([
          ...storedPlans,
          ...mockCoursePlans.filter(
            (plan) =>
              !storedPlans.some((storedPlan) => storedPlan.id === plan.id),
          ),
        ]);
      }
    } catch (error) {
      console.error("Error loading stored course plans:", error);
    }
  }, []);

  useEffect(() => {
    const handleCourseUploaded = () => {
      try {
        // Get updated course plans from localStorage
        const storedPlans = JSON.parse(
          localStorage.getItem("coursePlans") || "[]",
        );

        if (storedPlans && storedPlans.length > 0) {
          const updatedPlans = [
            ...storedPlans,
            ...mockCoursePlans.filter(
              (plan) =>
                !storedPlans.some((storedPlan) => storedPlan.id === plan.id),
            ),
          ];

          setCoursePlans(updatedPlans);
          setActiveTab("my-courses");

          console.log("Course plans updated:", updatedPlans);
        }
      } catch (error) {
        console.error("Error handling course upload:", error);
      }
    };

    const handleCourseSelected = (event: Event) => {
      const customEvent = event as CustomEvent<CoursePlan>;
      setSelectedCourse(customEvent.detail);
      setActiveTab("view-course");
    };

    const handleCoursePlansUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<CoursePlan[]>;
      const updatedPlans = customEvent.detail;

      // Merge with existing mock data, avoiding duplicates
      setCoursePlans([
        ...updatedPlans,
        ...mockCoursePlans.filter(
          (plan) =>
            !updatedPlans.some((updatedPlan) => updatedPlan.id === plan.id),
        ),
      ]);
    };

    window.addEventListener("course-uploaded", handleCourseUploaded);
    window.addEventListener("course-selected", handleCourseSelected);
    window.addEventListener("course-plans-updated", handleCoursePlansUpdated);

    return () => {
      window.removeEventListener("course-uploaded", handleCourseUploaded);
      window.removeEventListener("course-selected", handleCourseSelected);
      window.removeEventListener(
        "course-plans-updated",
        handleCoursePlansUpdated,
      );
    };
  }, []);

  const handleGenerate = async (subject: string, department: string) => {
    setIsGenerating(true);

    try {
      // Call OpenAI API to generate course plan
      const response = await fetch("/api/generate-course-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, department }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const generatedPlan = await response.json();
      setGeneratedPlan(generatedPlan);
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating course plan:", error);
      setIsGenerating(false);

      // Fallback to a basic template if API fails
      const fallbackPlan = {
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

      setGeneratedPlan(fallbackPlan);
    }
  };

  // This function is no longer needed as the CourseUpload component handles this internally

  // This function is no longer needed as CourseList handles this internally

  const handleApproveCourse = (id: string, comments: string) => {
    const updatedPlans = coursePlans.map((course) =>
      course.id === id
        ? {
            ...course,
            status: "approved",
            comments,
            updatedAt: new Date().toISOString(),
            reviewedBy: currentUser.name,
            notificationRead: false,
          }
        : course,
    );

    setCoursePlans(updatedPlans);

    // Set latest feedback for notifications
    const approvedCourse = updatedPlans.find((course) => course.id === id);
    if (approvedCourse) {
      setLatestFeedback(approvedCourse);
    }

    // Update localStorage
    localStorage.setItem(
      "coursePlans",
      JSON.stringify(
        updatedPlans.filter(
          (plan) => !plan.id?.startsWith("course-") || plan.id === id,
        ),
      ),
    );

    // Broadcast the update to other components
    window.dispatchEvent(
      new CustomEvent("course-plans-updated", {
        detail: updatedPlans,
      }),
    );
  };

  const handleRejectCourse = (id: string, comments: string) => {
    const updatedPlans = coursePlans.map((course) =>
      course.id === id
        ? {
            ...course,
            status: "rejected",
            comments,
            updatedAt: new Date().toISOString(),
            reviewedBy: currentUser.name,
            notificationRead: false,
          }
        : course,
    );

    setCoursePlans(updatedPlans);

    // Set latest feedback for notifications
    const rejectedCourse = updatedPlans.find((course) => course.id === id);
    if (rejectedCourse) {
      setLatestFeedback(rejectedCourse);
    }

    // Update localStorage
    localStorage.setItem(
      "coursePlans",
      JSON.stringify(
        updatedPlans.filter(
          (plan) => !plan.id?.startsWith("course-") || plan.id === id,
        ),
      ),
    );

    // Broadcast the update to other components
    window.dispatchEvent(
      new CustomEvent("course-plans-updated", {
        detail: updatedPlans,
      }),
    );
  };

  const handleRequestRevision = (
    id: string,
    comments: string,
    revisionRequests: string[],
  ) => {
    const updatedPlans = coursePlans.map((course) =>
      course.id === id
        ? {
            ...course,
            status: "revision",
            comments,
            revisionRequests,
            updatedAt: new Date().toISOString(),
            reviewedBy: currentUser.name,
            notificationRead: false,
          }
        : course,
    );

    setCoursePlans(updatedPlans);

    // Set latest feedback for notifications
    const revisionCourse = updatedPlans.find((course) => course.id === id);
    if (revisionCourse) {
      setLatestFeedback(revisionCourse);
    }

    // Update localStorage
    localStorage.setItem(
      "coursePlans",
      JSON.stringify(
        updatedPlans.filter(
          (plan) => !plan.id?.startsWith("course-") || plan.id === id,
        ),
      ),
    );

    // Broadcast the update to other components
    window.dispatchEvent(
      new CustomEvent("course-plans-updated", {
        detail: updatedPlans,
      }),
    );
  };

  const handleMarkNotificationRead = (id: string) => {
    const updatedPlans = coursePlans.map((course) =>
      course.id === id
        ? {
            ...course,
            notificationRead: true,
          }
        : course,
    );

    setCoursePlans(updatedPlans);

    // Clear latest feedback if it's the same course
    if (latestFeedback && latestFeedback.id === id) {
      setLatestFeedback(null);
    }

    // Update localStorage
    localStorage.setItem(
      "coursePlans",
      JSON.stringify(
        updatedPlans.filter(
          (plan) => !plan.id?.startsWith("course-") || plan.id === id,
        ),
      ),
    );

    // Broadcast the update to other components
    window.dispatchEvent(
      new CustomEvent("course-plans-updated", {
        detail: updatedPlans,
      }),
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
                    currentPlan={generatedPlan}
                    latestFeedback={latestFeedback || undefined}
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
                <div className="mb-4">
                  <Input
                    placeholder="Search by course title, department, or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <CourseList
                  courses={filteredCoursePlans}
                  userRole={currentUser.role}
                  onApproveCourse={handleApproveCourse}
                  onRejectCourse={handleRejectCourse}
                  onRequestRevision={handleRequestRevision}
                  onMarkNotificationRead={handleMarkNotificationRead}
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
