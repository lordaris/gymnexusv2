import User from "../../../models/User";
import jwt from "jsonwebtoken";
import dbConnect from "../../../utils/mongodb";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/*
Login controller
*/

export default async function loginUser(req, res) {
  const { email, password } = req.body;
  await dbConnect();
  try {
    const user = await User.login(email, password);

    // Create token
    const token = createToken(user._id);
    const role = user.role;
    const id = user._id;
    res.status(200).json({ email, token, role, id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
