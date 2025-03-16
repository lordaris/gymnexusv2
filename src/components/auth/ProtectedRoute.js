import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

/**
 * Higher-order component to protect routes requiring authentication
 * @param {React.Component} Component - The component to be rendered if authenticated
 * @param {Object} options - Configuration options
 * @param {string|null} options.requiredRole - Role required to access the route (optional)
 * @param {string} options.redirectPath - Path to redirect if not authenticated
 * @returns {React.Component}
 */
export function withProtection(Component, options = {}) {
  const { requiredRole = null, redirectPath = "/login" } = options;

  return function ProtectedRoute(props) {
    const { user, loading, initialized, isAuthenticated } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      // Don't do anything until auth is initialized
      if (!initialized) return;

      // Check if user is authenticated
      if (!isAuthenticated()) {
        toast.error("Please login to access this page");
        router.replace(redirectPath);
        return;
      }

      // Check if user has required role
      if (requiredRole && user?.role !== requiredRole) {
        toast.error("You don't have permission to access this page");

        // Redirect based on user role
        const rolePath =
          user?.role === "COACH" ? "/coach/dashboard" : "/user/dashboard";
        router.replace(rolePath);
        return;
      }

      // User is authorized
      setAuthorized(true);
    }, [router, initialized, isAuthenticated, user]);

    // Show loading or nothing while checking auth
    if (loading || !authorized) {
      return (
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Render the protected component
    return <Component {...props} />;
  };
}

/**
 * HOC specifically for coach-only routes
 */
export function withCoachProtection(Component) {
  return withProtection(Component, {
    requiredRole: "COACH",
    redirectPath: "/login",
  });
}

/**
 * HOC specifically for athlete-only routes
 */
export function withAthleteProtection(Component) {
  return withProtection(Component, {
    requiredRole: "ATHLETE",
    redirectPath: "/login",
  });
}

// Public route - redirects authenticated users to dashboard
export function PublicRoute({ children }) {
  const { isAuthenticated, user, initialized } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    if (isAuthenticated()) {
      // Redirect authenticated users to appropriate dashboard
      const dashboardPath =
        user.role === "COACH" ? "/coach/dashboard" : "/user/dashboard";
      router.replace(dashboardPath);
    } else {
      setShouldRender(true);
    }
  }, [isAuthenticated, user, router, initialized]);

  if (!initialized || !shouldRender) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
}
