import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Link from "next/link";
import { useForm } from "../../hooks/useForm";
import { validateLoginForm } from "../../utils/validation";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  const [csrfToken, setCsrfToken] = useState("");
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    setErrors,
  } = useForm({
    email: "",
    password: "",
  });

  useEffect(() => {
    fetch("/api/csrf-token")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Add CSRF token to headers
      const headers = { "X-CSRF-Token": csrfToken };
      const response = await axios.post(
        "/api/users/login",
        { email: values.email, password: values.password },
        { headers }
      );

      // Handle successful login
      if (response.data.token) {
        Cookies.set("token", response.data.token);
        Cookies.set("role", response.data.role);
        Cookies.set("user", response.data.id);

        // Redirect based on role
        router.push(
          response.data.role === "COACH"
            ? "/coach/dashboard"
            : "/user/dashboard"
        );
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "Login failed");
    }

    // Validate form
    const isValid = validate(validateLoginForm);
    if (!isValid) {
      // Focus on the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && document.getElementById(firstErrorField)) {
        document.getElementById(firstErrorField).focus();
      }
      return;
    }

    const result = await login({
      email: values.email,
      password: values.password,
    });

    if (result.success) {
      // Navigate using window.location instead of router.push to avoid SecurityError
      if (result.role === "ATHLETE") {
        window.location.href = "/user/dashboard";
      } else {
        window.location.href = "/coach/dashboard";
      }
    } else {
      // Show error in form
      setErrors({
        form: result.error || "Invalid email or password",
      });
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="_csrf" value={csrfToken} />

            {errors.form && (
              <div className="alert alert-error">
                <span>{errors.form}</span>
              </div>
            )}

            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required={true}
              placeholder="Email address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              label="Email Address"
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required={true}
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              label="Password"
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={authLoading}
                fullWidth
              >
                {authLoading ? "Logging in..." : "Login"}
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
