import { supabase } from "./supabase";

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
  }

  // Clear localStorage
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("userId");
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const checkAuthStatus = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  return {
    isAuthenticated: isAuthenticated === "true",
    userRole,
    userName,
    userId,
  };
};
