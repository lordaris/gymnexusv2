import User from "../../../models/User";
import jwt from "jsonwebtoken";
import dbConnect from "../../../utils/mongodb";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export default async function loginUser(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    await dbConnect();
    const user = await User.login(email, password);

    // Create token
    const token = createToken(user._id);
    const role = user.role;
    const id = user._id;

    return res.status(200).json({ email, token, role, id });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(400).json({ message: err.message });
  }
}
