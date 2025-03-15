import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import CoachLayout from "../../../../../components/ui/coachLayout";
import { toast } from "react-toastify";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { PageHeader } from "../../../../../components/ui/pageHeader";

export default function SignupPage() {
  const id = Cookies.get("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ATHLETE");
  const [errorMessage, setErrorMessage] = useState("");
  const addedBy = id;
  const router = useRouter();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [PasswordChecklist, setPasswordChecklist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/users/signup",
        {
          email,
          password,
          role,
          addedBy,
        }
      );
      toast.success("User account created successfully", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      await router.push("/coach/dashboard/users");
    } catch (error) {
      // Safely handle error messages
      const errorMsg = error.response?.data?.message || "An error occurred";

      if (errorMsg === "User already exists") {
        toast.error("User already exists");
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordValidityChange = (isValid) => {
    setIsPasswordValid(isValid);
  };

  useEffect(() => {
    import("react-password-checklist").then((module) => {
      setPasswordChecklist(() => module.default);
    });
  }, []);

  return (
    <CoachLayout>
      <div className="flex flex-col h-full items-center justify-center p-6 bg-base-100">
        <div className="w-full max-w-md">
          <PageHeader
            title="Create a new user"
            subtitle="Add a new athlete to your roster"
          />

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
              className="input-primary"
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
              className="input-primary"
            />

            {PasswordChecklist && (
              <div className="mt-2">
                <PasswordChecklist
                  rules={["minLength", "specialChar", "number", "capital"]}
                  minLength={8}
                  value={password}
                  onChange={handlePasswordValidityChange}
                />
              </div>
            )}

            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading || !isPasswordValid}
                fullWidth
              >
                {isLoading ? "Loading..." : "Create Account"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </CoachLayout>
  );
}
