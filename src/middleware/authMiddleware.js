import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Verify the validity of the JWT
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
