"use client";

import { useState } from "react";
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
import { Upload, Check } from "lucide-react";

interface CourseUploadProps {
  onUpload: (plan: CoursePlan) => void;
  currentPlan?: CoursePlan;
}

export default function CourseUpload({
  onUpload = () => {},
  currentPlan,
}: CourseUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = () => {
    if (!currentPlan) return;

    setIsUploading(true);

    // Simulate API call
    setTimeout(() => {
      onUpload({
        ...currentPlan,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      });
      setIsUploading(false);
      setUploadSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1500);
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Upload to Course Repository
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md text-sm text-blue-700">
            <p>
              Upload this course plan to the central repository for review by
              your department dean. Once uploaded, you can track its approval
              status.
            </p>
          </div>

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
