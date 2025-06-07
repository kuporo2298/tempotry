"use client";

import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check for admin login
      if (email === "admin@gmail.com" && password === "admin") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userName", "Administrator");
        router.push("/admin");
        return;
      }

      // Check if Supabase is configured
      if (!supabase) {
        setError(
          "Database connection not configured. Please contact the administrator.",
        );
        setIsLoading(false);
        return;
      }

      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(
          "Invalid credentials or your account has not been approved yet.",
        );
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Get user details from our users table
        const { data: userData, error: userError } = await supabase!
          .from("users")
          .select("*")
          .eq("email", email)
          .eq("approved", true)
          .single();

        if (userError || !userData) {
          setError("Your account has not been approved yet.");
          await supabase!.auth.signOut();
          setIsLoading(false);
          return;
        }

        // Set authentication in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userId", userData.id);

        // Redirect based on role
        if (userData.role === "dean") {
          router.push("/dean");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-right mb-2">
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
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
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the course planning system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {error && <div className="text-sm text-destructive">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
