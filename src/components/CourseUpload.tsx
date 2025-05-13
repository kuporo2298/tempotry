"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CoursePlan } from "@/lib/types";
import { Upload, Check, AlertCircle, FileEdit } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useRouter } from "next/navigation";

interface CourseUploadProps {
  currentPlan?: CoursePlan;
  latestFeedback?: CoursePlan;
}

export default function CourseUpload({
  currentPlan,
  latestFeedback,
}: CourseUploadProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(() => {
    setError(null);
    if (!currentPlan) return;

    setIsUploading(true);

    // Simulate API call
    setTimeout(() => {
      try {
        // Create a new plan with the necessary fields
        const newPlan = {
          ...currentPlan,
          id: `course-${Date.now()}`,
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          createdBy: "user-1",
        };

        // Store the plan in localStorage to simulate persistence
        const existingPlans = JSON.parse(
          localStorage.getItem("coursePlans") || "[]",
        );

        // Add the new plan to the mock data in memory
        const updatedPlans = [newPlan, ...existingPlans];
        localStorage.setItem("coursePlans", JSON.stringify(updatedPlans));

        // Update global state by dispatching a custom event with the updated plans
        window.dispatchEvent(
          new CustomEvent("course-plans-updated", {
            detail: updatedPlans,
          }),
        );

        setIsUploading(false);
        setUploadSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
          // Navigate to the "my-courses" tab
          window.dispatchEvent(new CustomEvent("course-uploaded"));
        }, 3000);
      } catch (err) {
        console.error("Error uploading course plan:", err);
        setIsUploading(false);
        setError("Failed to upload course plan. Please try again.");
      }
    }, 1500);
  }, [currentPlan]);

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Upload to Course Repository
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latestFeedback &&
            latestFeedback.status === "approved" &&
            !latestFeedback.notificationRead && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle>Course Plan Approved</AlertTitle>
                <AlertDescription>
                  Your course plan has been approved by the department dean.
                  {latestFeedback.comments && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">Comments:</p>
                      <p>{latestFeedback.comments}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

          {latestFeedback &&
            latestFeedback.status === "rejected" &&
            !latestFeedback.notificationRead && (
              <Alert className="bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle>Course Plan Rejected</AlertTitle>
                <AlertDescription>
                  Your course plan has been rejected by the department dean.
                  {latestFeedback.comments && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">Reason:</p>
                      <p>{latestFeedback.comments}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

          {latestFeedback &&
            latestFeedback.status === "revision" &&
            !latestFeedback.notificationRead && (
              <Alert className="bg-orange-50 border-orange-200 text-orange-800">
                <FileEdit className="h-4 w-4 text-orange-600" />
                <AlertTitle>Revision Requested</AlertTitle>
                <AlertDescription>
                  The department dean has requested revisions to your course
                  plan.
                  {latestFeedback.comments && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">Comments:</p>
                      <p>{latestFeedback.comments}</p>
                    </div>
                  )}
                  {latestFeedback.revisionRequests &&
                    latestFeedback.revisionRequests.length > 0 && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">Requested Changes:</p>
                        <ul className="list-disc pl-5 mt-1">
                          {latestFeedback.revisionRequests.map(
                            (request, index) => (
                              <li key={index}>{request}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </AlertDescription>
              </Alert>
            )}

          <div className="p-4 bg-blue-50 rounded-md text-sm text-blue-700">
            <p>
              Upload this course plan to the central repository for review by
              your department dean. Once uploaded, you can track its approval
              status.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              <p className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </p>
            </div>
          )}

          {currentPlan ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Course Title:</div>
                <div>{currentPlan.subject}</div>

                <div className="font-medium">Department:</div>
                <div>{currentPlan.department}</div>

                <div className="font-medium">Course Code:</div>
                <div>{currentPlan.courseCode || "Not specified"}</div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-md text-sm text-yellow-700">
              No course plan has been generated yet. Please generate a course
              plan first.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!currentPlan || isUploading || uploadSuccess}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
              Uploading...
            </>
          ) : uploadSuccess ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Uploaded Successfully
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload for Review
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
