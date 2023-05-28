import User from "../../../../models/User";
import dbConnect from "../../../../utils/mongodb";

/*
Find users by using their coach ID.
*/

export default async function listUsersByCoach(req, res) {
  const { coachId } = req.query;
  await dbConnect();
  try {
    const users = await User.find({ addedBy: coachId }).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
