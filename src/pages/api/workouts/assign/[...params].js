import { Workout } from "../../../models/Workout";
import User from "../../../models/User";
import dbConnect from "../../../utils/mongodb";
export default async function assignWorkoutToUser(req, res) {
  const { params } = req.query;
  const [workoutId, userId] = params;
  await dbConnect();

  try {
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (workout.assignedTo.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User already assigned to this workout" });
    }

    workout.assignedTo.push(userId);
    await workout.save();

    res.json({ message: "User assigned to workout successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
