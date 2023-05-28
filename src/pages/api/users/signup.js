import User from "../../../models/User";
import jwt from "jsonwebtoken";
import dbConnect from "../../../utils/mongodb";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export default async function signupUser(req, res) {
  const { email, password, role, addedBy } = req.body;
  await dbConnect();
  try {
    const user = await User.signup(email, password, role, addedBy);

    // Create token
    const token = createToken(user._id);
    const id = user._id;
    res.status(200).json({ id, email, token, addedBy });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
