import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingSpinner } from "./dataLoader";

export function AuthGuard({ children, requiredRole = null }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Skip auth check for public pages
    const publicPaths = ["/", "/login", "/coach/signup"];
    if (publicPaths.includes(router.pathname)) {
      setIsAuthorized(true);
      return;
    }

    // Wait for auth to initialize
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      // Use window.location.href instead of router.push
      window.location.href = "/login";
      return;
    }

    // Check for role requirement
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      const redirectPath =
        user.role === "COACH" ? "/coach/dashboard" : "/user/dashboard";

      window.location.href = redirectPath;
      return;
    }

    // User is authorized
    setIsAuthorized(true);
  }, [loading, user, router, isAuthenticated, requiredRole]);

  // Show loading spinner while checking auth
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export function CoachGuard({ children }) {
  return <AuthGuard requiredRole="COACH">{children}</AuthGuard>;
}

export function AthleteGuard({ children }) {
  return <AuthGuard requiredRole="ATHLETE">{children}</AuthGuard>;
}

export default AuthGuard;
