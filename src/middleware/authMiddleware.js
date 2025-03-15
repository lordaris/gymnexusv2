import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
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
    req.user = decoded;

    // Call the next function
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Token expired" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    return res
      .status(401)
      .json({ message: "Unauthorized - Authentication failed" });
  }
};

export default authMiddleware;
