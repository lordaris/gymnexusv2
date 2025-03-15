import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import LoginRedirect from "../../components/ui/loginRedirect";
import Head from "next/head";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Link from "next/link";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  LoginRedirect();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("Attempting login with:", { email });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        { email, password }
      );

      console.log("Login response:", response.status);

      const { token, role, id } = response.data;

      // Set cookies
      Cookies.set("token", token);
      Cookies.set("role", role);
      Cookies.set("user", id);

      toast.success("Login successful!");

      // Redirect based on role
      if (role === "ATHLETE") {
        router.push("/user/dashboard");
      } else {
        router.push("/coach/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Display detailed error information
      const status = error.response?.status;
      const errorMsg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setErrorMessage(`Error (${status || "unknown"}): ${errorMsg}`);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>gymNEXUS - Login</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base-100">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-lato mb-2">Login to your account</h1>
            <p className="text-base-content/70">Welcome back to gymNEXUS</p>
          </div>

          {errorMessage && (
            <div className="alert alert-error shadow-lg mb-6">
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />

            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required={true}
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required={true}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-base-content/70">
                Don't have an account?{" "}
                <Link
                  href="/coach/signup"
                  className="text-primary hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
