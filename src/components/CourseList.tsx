"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { CoursePlan } from "@/lib/types";
import { Check, X, Eye, Clock } from "lucide-react";

interface CourseListProps {
  courses: CoursePlan[];
  userRole: "teacher" | "dean";
  onViewCourse: (course: CoursePlan) => void;
  onApproveCourse?: (id: string, comments: string) => void;
  onRejectCourse?: (id: string, comments: string) => void;
}

export default function CourseList({
  courses = [],
  userRole = "teacher",
  onViewCourse = () => {},
  onApproveCourse = () => {},
  onRejectCourse = () => {},
}: CourseListProps) {
  const [selectedCourse, setSelectedCourse] = useState<CoursePlan | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewType, setReviewType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [comments, setComments] = useState("");

  const handleOpenReviewDialog = (
    course: CoursePlan,
    type: "approve" | "reject",
  ) => {
    setSelectedCourse(course);
    setReviewType(type);
    setComments("");
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedCourse?.id || !reviewType) return;

    if (reviewType === "approve") {
      onApproveCourse(selectedCourse.id, comments);
    } else {
      onRejectCourse(selectedCourse.id, comments);
    }

    setIsReviewDialogOpen(false);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "pending":
      default:
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-4">
        {courses.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-6 text-center text-gray-500">
              No course plans available.
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card
              key={course.id}
              className="bg-white hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{course.subject}</h3>
                    <p className="text-sm text-gray-500">
                      {course.department} • {course.courseCode || "No Code"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {getStatusBadge(course.status)}
                      <span className="text-xs text-gray-500">
                        Version {course.version || 1} • Updated{" "}
                        {course.updatedAt
                          ? new Date(course.updatedAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewCourse(course)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>

                    {userRole === "dean" && course.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          onClick={() =>
                            handleOpenReviewDialog(course, "approve")
                          }
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() =>
                            handleOpenReviewDialog(course, "reject")
                          }
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}

                    {userRole === "teacher" && course.status === "pending" && (
                      <Badge className="bg-yellow-100 text-yellow-800 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Awaiting Review
                      </Badge>
                    )}
                  </div>
                </div>

                {course.comments && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                    <p className="font-medium">Reviewer Comments:</p>
                    <p className="text-gray-600">{course.comments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewType === "approve"
                ? "Approve Course Plan"
                : "Reject Course Plan"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2 text-sm font-medium">
              Course: {selectedCourse?.subject}
            </p>
            <Textarea
              placeholder="Add comments for the teacher (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              className={
                reviewType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {reviewType === "approve" ? "Approve" : "Reject"} Course Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
