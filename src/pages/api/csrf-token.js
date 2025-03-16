import { randomBytes } from "crypto";
import { withCookies } from "../../utils/cookies";

// CSRF token expiry time (24 hours)
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

// Generate a random token
function generateToken() {
  return randomBytes(32).toString("hex");
}

// CSRF token handler
async function csrfTokenHandler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Generate a new CSRF token
  const csrfToken = generateToken();

  // Set the token in a cookie (httpOnly: false allows JavaScript to read it)
  res.setHeader(
    "Set-Cookie",
    `csrfToken=${csrfToken}; Path=/; SameSite=Strict; Secure=${
      process.env.NODE_ENV === "production"
    }; Max-Age=${CSRF_TOKEN_EXPIRY / 1000}`
  );

  // Return the CSRF token to the client
  res.json({ csrfToken });
}

// Export with cookie handler
export default withCookies(csrfTokenHandler);
