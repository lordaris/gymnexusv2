import User from "../../../models/User";
import jwt from "jsonwebtoken";
import dbConnect from "../../../utils/mongodb";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export default async function signupUser(req, res) {
  // Check if method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, role, addedBy } = req.body;

  // Validate required fields
  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Email, password, and role are required" });
  }

  try {
    // Connect to database
    await dbConnect();
    console.log("DB connected, attempting to create user:", { email, role });

    // Create user
    const user = await User.signup(email, password, role, addedBy);
    console.log("User created successfully:", user._id);

    // Create token
    const token = createToken(user._id);
    const id = user._id;

    return res.status(200).json({ id, email, token, role, addedBy });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(400).json({ message: err.message });
  }
}
