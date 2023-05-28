import { Workout } from "../../../../models/Workout";
import dbConnect from "../../../../utils/mongodb";
import mongoose from "mongoose";
import authMiddleware from "../../../../middleware/authMiddleware";
export default function listWorkoutsByCoach(req, res) {
  return new Promise((resolve, reject) => {
    authMiddleware(req, res, async () => {
      const { coachId } = req.query;
      await dbConnect();
      
      if (!mongoose.Types.ObjectId.isValid(coachId)) {
        res.status(404).json({ message: "No coach with this id!" });
        resolve();
      } else {
        try {
          const workouts = await Workout.find({ coach: coachId }).sort({
            createdAt: -1,
          });
          res.status(200).json(workouts);
          resolve();
        } catch (err) {
          res.status(400).json({ message: err.message });
          reject(err);
        }
      }
    });
  });
}
