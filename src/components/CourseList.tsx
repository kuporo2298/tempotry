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
import {
  Check,
  X,
  Eye,
  Clock,
  AlertCircle,
  FileEdit,
  Bell,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface CourseListProps {
  courses: CoursePlan[];
  userRole: "teacher" | "dean";
  onApproveCourse?: (id: string, comments: string) => void;
  onRejectCourse?: (id: string, comments: string) => void;
  onRequestRevision?: (
    id: string,
    comments: string,
    revisionRequests: string[],
  ) => void;
  onMarkNotificationRead?: (id: string) => void;
}

export default function CourseList({
  courses = [],
  userRole = "teacher",
  onApproveCourse = () => {},
  onRejectCourse = () => {},
  onRequestRevision = () => {},
  onMarkNotificationRead = () => {},
}: CourseListProps) {
  const [selectedCourse, setSelectedCourse] = useState<CoursePlan | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewType, setReviewType] = useState<
    "approve" | "reject" | "revision" | null
  >(null);
  const [comments, setComments] = useState("");
  const [revisionRequests, setRevisionRequests] = useState<string[]>([]);
  const [currentRevisionRequest, setCurrentRevisionRequest] = useState("");

  const handleOpenReviewDialog = (
    course: CoursePlan,
    type: "approve" | "reject" | "revision",
  ) => {
    setSelectedCourse(course);
    setReviewType(type);
    setComments("");
    setRevisionRequests([]);
    setCurrentRevisionRequest("");
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedCourse?.id || !reviewType) return;

    if (reviewType === "approve") {
      onApproveCourse(selectedCourse.id, comments);
    } else if (reviewType === "reject") {
      onRejectCourse(selectedCourse.id, comments);
    } else if (reviewType === "revision") {
      onRequestRevision(selectedCourse.id, comments, revisionRequests);
    }

    setIsReviewDialogOpen(false);
  };

  const handleAddRevisionRequest = () => {
    if (currentRevisionRequest.trim()) {
      setRevisionRequests([...revisionRequests, currentRevisionRequest.trim()]);
      setCurrentRevisionRequest("");
    }
  };

  const handleRemoveRevisionRequest = (index: number) => {
    setRevisionRequests(revisionRequests.filter((_, i) => i !== index));
  };

  const handleMarkNotificationRead = (id: string) => {
    onMarkNotificationRead(id);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "revision":
        return <Badge className="bg-orange-500">Revision Requested</Badge>;
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
                      onClick={() => {
                        // Store the selected course in localStorage
                        localStorage.setItem(
                          "selectedCourse",
                          JSON.stringify(course),
                        );
                        // Dispatch a custom event to notify that a course was selected
                        window.dispatchEvent(
                          new CustomEvent("course-selected", {
                            detail: course,
                          }),
                        );
                      }}
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
                          className="border-orange-500 text-orange-500 hover:bg-orange-50"
                          onClick={() =>
                            handleOpenReviewDialog(course, "revision")
                          }
                        >
                          <FileEdit className="h-4 w-4 mr-1" /> Request Revision
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

                    {userRole === "teacher" && (
                      <>
                        {course.status === "pending" && (
                          <Badge className="bg-yellow-100 text-yellow-800 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> Awaiting Review
                          </Badge>
                        )}
                        {(course.status === "approved" ||
                          course.status === "rejected" ||
                          course.status === "revision") &&
                          !course.notificationRead && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                    onClick={() =>
                                      handleMarkNotificationRead(
                                        course.id || "",
                                      )
                                    }
                                  >
                                    <Bell className="h-4 w-4 mr-1" /> New
                                    Feedback
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to mark as read</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                      </>
                    )}
                  </div>
                </div>

                {course.comments && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                    <p className="font-medium">Reviewer Comments:</p>
                    <p className="text-gray-600">{course.comments}</p>
                  </div>
                )}

                {course.revisionRequests &&
                  course.revisionRequests.length > 0 && (
                    <div className="mt-3 p-3 bg-orange-50 rounded-md text-sm">
                      <p className="font-medium flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
                        Revision Requests:
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-gray-600">
                        {course.revisionRequests.map((request, index) => (
                          <li key={index}>{request}</li>
                        ))}
                      </ul>
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
                : reviewType === "revision"
                  ? "Request Revision"
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

            {reviewType === "revision" && (
              <div className="mt-4 space-y-4">
                <p className="text-sm font-medium">
                  Specific Revision Requests:
                </p>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add specific revision request"
                    value={currentRevisionRequest}
                    onChange={(e) => setCurrentRevisionRequest(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddRevisionRequest}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>

                {revisionRequests.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <ul className="space-y-2">
                      {revisionRequests.map((request, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>{request}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRevisionRequest(index)}
                            className="h-6 w-6 p-0 text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
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
                  : reviewType === "revision"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-red-600 hover:bg-red-700"
              }
            >
              {reviewType === "approve"
                ? "Approve"
                : reviewType === "revision"
                  ? "Request Revision"
                  : "Reject"}{" "}
              Course Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
