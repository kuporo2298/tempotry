"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole, SignupRequest } from "@/lib/types";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("teacher");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Check if email already exists in pending requests
      const storedRequests = localStorage.getItem("signupRequests");
      const signupRequests: SignupRequest[] = storedRequests
        ? JSON.parse(storedRequests)
        : [];

      if (signupRequests.some((request) => request.email === email)) {
        setError("An account with this email is already pending approval");
        setIsLoading(false);
        return;
      }

      // Check if email already exists in approved users
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      if (users.some((user) => user.email === email)) {
        setError("An account with this email already exists");
        setIsLoading(false);
        return;
      }

      // Create new signup request
      const newRequest: SignupRequest = {
        id: `request-${Date.now()}`,
        name,
        email,
        role,
        password,
        createdAt: new Date().toISOString(),
      };

      // Store signup request in localStorage
      signupRequests.push(newRequest);
      localStorage.setItem("signupRequests", JSON.stringify(signupRequests));

      // Show success message
      setSuccess(
        "Your account request has been submitted and is pending approval",
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("teacher");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to create account request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-primary-foreground">
              ULS
            </span>
          </div>
          <h1 className="text-2xl font-bold">University of La Salette</h1>
          <p className="text-muted-foreground">Course Learning Plan Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Sign up to access the course planning system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <p className="text-green-800">{success}</p>
                </div>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="teacher"
                        name="role"
                        value="teacher"
                        checked={role === "teacher"}
                        onChange={() => setRole("teacher")}
                        className="mr-2"
                      />
                      <Label htmlFor="teacher" className="cursor-pointer">
                        Faculty
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="dean"
                        name="role"
                        value="dean"
                        checked={role === "dean"}
                        onChange={() => setRole("dean")}
                        className="mr-2"
                      />
                      <Label htmlFor="dean" className="cursor-pointer">
                        Dean
                      </Label>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting request..." : "Sign Up"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
