import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginRedirect from "../../../components/ui/loginRedirect";
import { toast } from "react-toastify";
import Head from "next/head";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("COACH"); // Fixed as COACH for this page
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [PasswordChecklist, setPasswordChecklist] = useState(null);
  const [passwordChecklistError, setPasswordChecklistError] = useState(false);

  const validatePasswordManually = (password) => {
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasCapital = /[A-Z]/.test(password);

    return hasMinLength && hasSpecialChar && hasNumber && hasCapital;
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    // If the component failed to load, use manual validation
    if (passwordChecklistError) {
      setIsPasswordValid(validatePasswordManually(newPassword));
    }
  };

  useEffect(() => {
    // Dynamically import the PasswordChecklist component on the client-side
    import("react-password-checklist")
      .then((module) => {
        setPasswordChecklist(() => module.default);
      })
      .catch((error) => {
        console.error("Failed to load PasswordChecklist:", error);
        setPasswordChecklistError(true);
        // Set initial password validity using manual check
        setIsPasswordValid(validatePasswordManually(password));
      });
  }, []);

  LoginRedirect();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!isPasswordValid) {
      setErrorMessage("Please ensure your password meets all requirements");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Signing up with:", { email, role });

      const response = await axios.post("/api/users/signup", {
        email,
        password,
        role,
      });

      console.log("Signup successful:", response.status);

      toast.success("Coach account created successfully");

      // Use window.location for more reliable navigation
      window.location.href = "/login";
    } catch (error) {
      console.error("Signup error:", error);

      // Detailed error handling
      const status = error.response?.status;
      const errorMsg =
        error.response?.data?.message ||
        "An error occurred during signup. Please try again.";

      setErrorMessage(`Error (${status || "unknown"}): ${errorMsg}`);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle password validity changes
  const handlePasswordValidityChange = (isValid) => {
    setIsPasswordValid(isValid);
  };

  useEffect(() => {
    // Dynamically import the PasswordChecklist component on the client-side
    import("react-password-checklist").then((module) => {
      setPasswordChecklist(() => module.default);
    });
  }, []);

  return (
    <>
      <Head>
        <title>gymNEXUS - Coach Signup</title>
      </Head>
      <div className="min-h-screen flex flex-col h-full items-center justify-center p-10 text-base-content bg-base-100">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-lato mb-2">Create a coach account</h1>
            <p className="text-base-content/70">It's free to get started</p>
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
              label="Email Address"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required={true}
                label="Password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />

              {passwordChecklistError ? (
                <div className="mt-2 bg-base-200 p-3 rounded">
                  <p className="text-sm mb-1">Password requirements:</p>
                  <ul className="list-disc pl-5 text-sm">
                    <li
                      className={
                        password.length >= 8 ? "text-success" : "text-error"
                      }
                    >
                      At least 8 characters
                    </li>
                    <li
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(password)
                          ? "text-success"
                          : "text-error"
                      }
                    >
                      At least one special character
                    </li>
                    <li
                      className={
                        /\d/.test(password) ? "text-success" : "text-error"
                      }
                    >
                      At least one number
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(password) ? "text-success" : "text-error"
                      }
                    >
                      At least one capital letter
                    </li>
                  </ul>
                </div>
              ) : PasswordChecklist ? (
                <div className="mt-2 bg-base-200 p-3 rounded">
                  <PasswordChecklist
                    rules={["minLength", "specialChar", "number", "capital"]}
                    minLength={8}
                    value={password}
                    onChange={handlePasswordValidityChange}
                  />
                </div>
              ) : (
                <div className="mt-2 bg-base-200 p-3 rounded">
                  <p>Checking password requirements...</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || !isPasswordValid}
              fullWidth
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-base-content/70">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
