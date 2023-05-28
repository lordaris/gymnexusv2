import  Workout  from "../../../../../models/Workout";
import dbConnect from "../../../../../utils/mongodb";
import mongoose from "mongoose";
import authMiddleware from "../../../../../middleware/authMiddleware";
export default async function listAssignedWorkouts(req, res) {
  await authMiddleware(req, res, async () => {
    const { userId } = req.query;

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: "No user with this id!" });
    }

    try {
      const workouts = await Workout.find({ assignedTo: userId }).sort({
        createdAt: -1,
      });
      res.status(200).json(workouts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
}
