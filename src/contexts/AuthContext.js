import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { authAPI } from "../utils/apiClient";
import { toast } from "react-toastify";

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize user on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const userId = Cookies.get("user");

      if (token && role && userId) {
        try {
          // Validate token
          await authAPI.validateToken();

          setUser({
            id: userId,
            role,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token is invalid or expired
          logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      const { token, role, id } = response.data;

      // Set cookies
      Cookies.set("token", token);
      Cookies.set("role", role);
      Cookies.set("user", id);

      // Set user state
      setUser({
        id,
        role,
        isAuthenticated: true,
      });

      toast.success("Login successful!");

      // Return success but let the component handle navigation
      return { success: true, role };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    setUser(null);

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  // Helper functions
  const isAuthenticated = () => !!user?.isAuthenticated;
  const isCoach = () => user?.role === "COACH";
  const isAthlete = () => user?.role === "ATHLETE";

  // Create value object
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isCoach,
    isAthlete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
