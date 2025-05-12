"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface CourseInputFormProps {
  onGenerate?: (subject: string, department: string) => void;
}

const departments = [
  "Computer Science",
  "Engineering",
  "Business Administration",
  "Education",
  "Arts and Sciences",
  "Nursing",
  "Theology",
];

export default function CourseInputForm({
  onGenerate = () => {},
}: CourseInputFormProps) {
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState(departments[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      onGenerate(subject, department);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Generate Course Learning Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Name</Label>
            <Input
              id="subject"
              placeholder="e.g. Introduction to Computer Science"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CardFooter className="px-0 pt-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isGenerating || !subject.trim()}
            >
              {isGenerating ? "Generating..." : "Generate Learning Plan"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
