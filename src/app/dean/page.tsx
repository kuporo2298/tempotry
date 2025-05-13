"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseList from "@/components/CourseList";
import { CoursePlan } from "@/lib/types";
import { mockCoursePlans, currentUser } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import CoursePlanPreview from "@/components/CoursePlanPreview";

export default function DeanPage() {
  const [activeTab, setActiveTab] = useState("pending-review");
  const [coursePlans, setCoursePlans] = useState<CoursePlan[]>(mockCoursePlans);
  const [selectedCourse, setSelectedCourse] = useState<CoursePlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter courses based on search term
  const filteredCoursePlans = coursePlans.filter(
    (course) =>
      course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.courseCode &&
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Filter pending courses for the dean's review
  const pendingCoursePlans = filteredCoursePlans.filter(
    (course) => course.status === "pending",
  );

  // Filter reviewed courses (approved, rejected, or revision requested)
  const reviewedCoursePlans = filteredCoursePlans.filter(
    (course) =>
      course.status === "approved" ||
      course.status === "rejected" ||
      course.status === "revision",
  );

  // Effect to listen for course selection events and sync with localStorage
  useEffect(() => {
    // Initial load from localStorage
    const storedPlans = JSON.parse(localStorage.getItem("coursePlans") || "[]");
    if (storedPlans.length > 0) {
      setCoursePlans([
        ...storedPlans,
        ...mockCoursePlans.filter(
          (plan) =>
            !storedPlans.some((storedPlan) => storedPlan.id === plan.id),
        ),
      ]);
    }

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

    window.addEventListener("course-selected", handleCourseSelected);
    window.addEventListener("course-plans-updated", handleCoursePlansUpdated);

    return () => {
      window.removeEventListener("course-selected", handleCourseSelected);
      window.removeEventListener(
        "course-plans-updated",
        handleCoursePlansUpdated,
      );
    };
  }, []);

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
                Dean's Course Plan Review Dashboard
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

        <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("pending-review")}
              className={`px-4 py-2 rounded-md ${activeTab === "pending-review" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setActiveTab("reviewed")}
              className={`px-4 py-2 rounded-md ${activeTab === "reviewed" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
              Reviewed Courses
            </button>
            <button
              onClick={() => setActiveTab("view-course")}
              className={`px-4 py-2 rounded-md ${activeTab === "view-course" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
              View Course
            </button>
          </div>
          <div className="w-full md:w-auto">
            <Input
              placeholder="Search by course title, department, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80"
            />
          </div>
        </div>

        {activeTab === "pending-review" && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Course Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseList
                courses={pendingCoursePlans}
                userRole="dean"
                onApproveCourse={handleApproveCourse}
                onRejectCourse={handleRejectCourse}
                onRequestRevision={handleRequestRevision}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "reviewed" && (
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Course Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseList
                courses={reviewedCoursePlans}
                userRole="dean"
                onApproveCourse={handleApproveCourse}
                onRejectCourse={handleRejectCourse}
                onRequestRevision={handleRequestRevision}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "view-course" && (
          <div className="space-y-4">
            {selectedCourse ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Course Plan Details</CardTitle>
                  <button
                    onClick={() => setActiveTab("pending-review")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Back to List
                  </button>
                </CardHeader>
                <CardContent>
                  <CoursePlanPreview plan={selectedCourse} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-10 text-center">
                  <p className="text-muted-foreground">
                    Select a course plan to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} University of La Salette. All rights
            reserved.
          </p>
          <p className="mt-1">Dean's Course Plan Review Dashboard</p>
        </footer>
      </div>
    </main>
  );
}
