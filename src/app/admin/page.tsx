"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupRequest, User } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  const [signupRequests, setSignupRequests] = useState<SignupRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  // Check if user is authenticated as admin
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      const userRole = localStorage.getItem("userRole");

      if (!authStatus || authStatus !== "true" || userRole !== "admin") {
        router.push("/login");
        return;
      }

      // Load signup requests and users
      loadData();
    };

    checkAuth();
  }, [router]);

  const loadData = async () => {
    setIsLoading(true);

    // Check if Supabase is configured
    if (!supabase) {
      console.error("Supabase not configured");
      setIsLoading(false);
      return;
    }

    try {
      // Load signup requests from Supabase
      const { data: requests, error: requestsError } = await supabase
        .from("signup_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (requestsError) {
        console.error("Error loading signup requests:", requestsError);
      } else {
        setSignupRequests(requests || []);
      }

      // Load users from Supabase
      const { data: usersList, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) {
        console.error("Error loading users:", usersError);
      } else {
        setUsers(usersList || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (request: SignupRequest) => {
    if (!supabase) {
      console.error("Supabase not configured");
      return;
    }

    try {
      // Create new user in users table
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          name: request.name,
          email: request.email,
          role: request.role,
          approved: true,
        })
        .select()
        .single();

      if (userError) {
        console.error("Error creating user:", userError);
        return;
      }

      // Remove request from signup_requests table
      const { error: deleteError } = await supabase
        .from("signup_requests")
        .delete()
        .eq("id", request.id);

      if (deleteError) {
        console.error("Error deleting signup request:", deleteError);
        return;
      }

      // Update local state
      setUsers([...users, newUser]);
      setSignupRequests(signupRequests.filter((r) => r.id !== request.id));
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (request: SignupRequest) => {
    if (!supabase) {
      console.error("Supabase not configured");
      return;
    }

    try {
      // Remove request from signup_requests table
      const { error: deleteError } = await supabase
        .from("signup_requests")
        .delete()
        .eq("id", request.id);

      if (deleteError) {
        console.error("Error deleting signup request:", deleteError);
        return;
      }

      // Also remove from Supabase Auth if they were created there
      // Note: In a production app, you might want to handle this differently
      // as you can't easily delete users from Supabase Auth via client-side code

      // Update local state
      setSignupRequests(signupRequests.filter((r) => r.id !== request.id));
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    router.push("/login");
  };

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

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
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
              <p className="text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-medium">Administrator</p>
              <p className="text-muted-foreground">Admin</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b flex">
            <button
              className={`px-4 py-2 font-medium ${activeTab === "pending" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Requests
              {signupRequests.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {signupRequests.length}
                </span>
              )}
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "approved" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("approved")}
            >
              Approved Users
              {users.length > 0 && (
                <span className="ml-2 bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
                  {users.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "pending" ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Account Requests</CardTitle>
                <CardDescription>
                  Review and approve or reject user signup requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {signupRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending signup requests
                  </div>
                ) : (
                  <div className="space-y-4">
                    {signupRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-medium">{request.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.email}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full capitalize">
                              {request.role}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              Requested:{" "}
                              {new Date(
                                request.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 self-end md:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleReject(request)}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request)}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approved Users</CardTitle>
                <CardDescription>
                  List of all approved users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No approved users yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full capitalize">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} University of La Salette. All rights
            reserved.
          </p>
          <p className="mt-1">Admin Dashboard</p>
        </footer>
      </div>
    </div>
  );
}
