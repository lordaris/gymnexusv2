import jwt from "jsonwebtoken";
import User from "../../../../models/User";

export default async function validateToken(req, res) {
  try {
    // Extract the token from the request headers
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    // Retrieve the user from the database based on the decoded userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Return the user's role
    res.json({ role: user.role });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
