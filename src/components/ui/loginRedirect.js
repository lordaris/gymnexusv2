import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
export default function LoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      // Use the router to redirect to the appropriate dashboard
      const role = Cookies.get("role");
      if (role === "ATHLETE") {
        router.push("/user/dashboard");
      }
      if (role === "COACH") {
        router.push("/coach/dashboard");
      }
    }
  }, [router]);
}
