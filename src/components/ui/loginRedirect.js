import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if token exists
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (token && role) {
      console.log(
        "User already authenticated, redirecting based on role:",
        role
      );

      // Redirect based on role
      if (role === "ATHLETE") {
        router.push("/user/dashboard");
      } else if (role === "COACH") {
        router.push("/coach/dashboard");
      }
    } else {
      console.log("No authentication found, staying on login/signup page");
    }
  }, [router]);

  // This component doesn't render anything
  return null;
}
