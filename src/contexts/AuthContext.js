import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { authAPI } from "../utils/apiClient";
import { toast } from "react-toastify";
import { handleError } from "../utils/errorHandling";

// Cookie configuration
const COOKIE_OPTIONS = {
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  expires: 1, // 1 day
};

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
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
            email: Cookies.get("email") || "",
            isAuthenticated: true,
          });
        } catch (error) {
          // Token is invalid or expired - clear cookies
          clearAuthCookies();
          console.log("Auth initialization failed:", error);
        }
      }

      setLoading(false);
      setInitialized(true);
    };

    initAuth();
  }, []);

  // Helper to clear auth cookies
  const clearAuthCookies = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    Cookies.remove("email");
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      const { token, role, id, email } = response.data;

      // Set cookies with security options
      Cookies.set("token", token, COOKIE_OPTIONS);
      Cookies.set("role", role, COOKIE_OPTIONS);
      Cookies.set("user", id, COOKIE_OPTIONS);
      if (email) Cookies.set("email", email, COOKIE_OPTIONS);

      // Set user state
      setUser({
        id,
        role,
        email: email || "",
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

  // Signup function
  const signup = async (userData) => {
    setLoading(true);

    try {
      const response = await authAPI.signup(userData);
      toast.success("Account created successfully!");
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = handleError(error, {
        context: "signup",
        defaultMessage: "Failed to create account",
        showToast: true,
      });

      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    clearAuthCookies();
    setUser(null);

    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, [clearAuthCookies]);

  // Check auth token expiration
  const checkTokenExpiration = useCallback(() => {
    const token = Cookies.get("token");
    if (!token) return false;

    try {
      // Simple validation - in a real app, you'd check token expiration
      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }, []);

  // Helper functions
  const isAuthenticated = useCallback(() => {
    return !!user?.isAuthenticated && checkTokenExpiration();
  }, [user, checkTokenExpiration]);

  const isCoach = useCallback(() => user?.role === "COACH", [user]);
  const isAthlete = useCallback(() => user?.role === "ATHLETE", [user]);

  // Create value object
  const value = {
    user,
    loading,
    initialized,
    login,
    signup,
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

export default AuthContext;
