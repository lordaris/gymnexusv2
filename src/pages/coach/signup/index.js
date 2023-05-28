import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import LoginRedirect from "../../../components/ui/loginRedirect";
import { toast } from "react-toastify";
export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("COACH");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false); // New state for password validity
  const [PasswordChecklist, setPasswordChecklist] = useState(null); // State to store the dynamically imported component

  LoginRedirect();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/users/signup",
        {
          email,
          password,
          role,
        }
      );
      toast.success("Coach account created successfully", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push("/login");
    } catch (error) {
      alert(error.response.data.message);
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
    <div className="min-h-screen flex flex-col h-full items-center justify-center p-10 text-base-content bg-base-100">
      <div className="max-w-md">
        <div>
          <h1 className="text-4xl m-4 font-lato">
            Create an account, is free!
          </h1>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="flex flex-col">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required={true}
                className="input input-ghost m-4 lg:w-full"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required={true}
                className="input input-ghost m-4 lg:w-full"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {PasswordChecklist && ( // Render the PasswordChecklist if it has been dynamically imported
                <PasswordChecklist
                  rules={["minLength", "specialChar", "number", "capital"]}
                  minLength={8}
                  value={password}
                  onChange={handlePasswordValidityChange} // Pass the handler function
                />
              )}
            </div>
            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-primary m-4"
                disabled={isLoading || !isPasswordValid} // Disable the button if loading or password is invalid
              >
                {isLoading ? "Loading..." : "Create Account"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
