import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Don't redirect if we're already on the right page to avoid reload loops
    if (router.pathname === "/login" || router.pathname === "/coach/signup") {
      return;
    }

    // Check if token exists
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (token && role) {
      console.log(
        "User already authenticated, redirecting based on role:",
        role
      );

      // Use window.location.href for redirecting instead of router.push
      // This avoids the security error in the browser
      if (
        role === "ATHLETE" &&
        !router.pathname.startsWith("/user/dashboard")
      ) {
        window.location.href = "/user/dashboard";
      } else if (
        role === "COACH" &&
        !router.pathname.startsWith("/coach/dashboard")
      ) {
        window.location.href = "/coach/dashboard";
      }
    } else {
      console.log("No authentication found, staying on login/signup page");
    }
  }, [router.pathname]);

  // This component doesn't render anything
  return null;
}
