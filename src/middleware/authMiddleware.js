import jwt from "jsonwebtoken";

/**
 * Authentication middleware for Next.js API routes
 * @param {Function} handler - The API route handler
 * @returns {Function} - Handler with authentication
 */
export function withAuth(handler) {
  return async function authMiddleware(req, res) {
    // Get the token from the Authorization header
    const token = req.headers.authorization;

    if (!token) {
      console.log("Authorization header missing");
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user info to the request object
      req.user = { _id: decoded._id };

      // Call the handler with authenticated request
      return handler(req, res);
    } catch (err) {
      console.error("JWT verification error:", err.message);

      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Token expired" });
      }

      if (err.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid token" });
      }

      return res
        .status(401)
        .json({ message: "Unauthorized - Authentication failed" });
    }
  };
}

export default withAuth;
