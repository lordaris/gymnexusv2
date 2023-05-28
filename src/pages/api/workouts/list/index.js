import { Workout } from "../../../models/Workout";
import dbConnect from "../../../utils/mongodb";
import authMiddleware from "../../../middleware/authMiddleware";
export default async function listAllWorkouts(req, res) {
  await dbConnect();

  await authMiddleware(req, res, async () => {
    try {
      const workouts = await Workout.find().sort({ createdAt: -1 });
      res.status(200).json(workouts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
}
