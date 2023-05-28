import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import CoachLayout from "../../../../components/ui/coachLayout";
import { toast } from "react-toastify";

// TODO Clean the code

export default function SignupPage() {
  const id = Cookies.get("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ATHLETE");
  const [errorMessage, setErrorMessage] = useState("");
  const addedBy = id;
  const router = useRouter();
  const [isPasswordValid, setIsPasswordValid] = useState(false); // New state for password validity
  const [PasswordChecklist, setPasswordChecklist] = useState(null); // State to store the dynamically imported component
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      const token = response.data.token;
      await router.push("/coach/dashboard/users");
    } catch (error) {
      if (error.response.data.message === "User already exists") {
        alert(error.response.data.message);
      } else {
        setErrorMessage(error.response.data.message);
      }
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
    <CoachLayout>
      <div
        className={
          "min-h-screen flex flex-col h-full items-center justify-center p-10 text-base-content bg-base-100"
        }
      >
        <div className="">
          <div>
            <h2 className="text-4xl m-4 font-thin font-lato">
              Create a new user
            </h2>
          </div>
          <form className="" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address{" "}
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required={true}
                  className={"input input-ghost m-4 lg:w-full"}
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
                  className={"input input-ghost m-4 lg:w-full"}
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
                  Rol
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary m-4"
                disabled={isLoading || !isPasswordValid} // Disable the button if loading or password is invalid
              >
                {isLoading ? "Loading..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CoachLayout>
  );
}
