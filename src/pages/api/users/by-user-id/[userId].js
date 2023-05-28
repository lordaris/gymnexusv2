import User from "../../../../models/User";
import dbConnect from "../../../../utils/mongodb";

/*
Find a user using its own ID 
*/

export default async function listUserById(req, res) {
  const { userId } = req.query;
  await dbConnect();
  try {
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
