import  Workout  from "../../../../models/Workout";
import authMiddleware from "../../../../middleware/authMiddleware";
import dbConnect from "../../../../utils/mongodb";

export default async function createWorkout(req, res) {
  await authMiddleware(req, res, async () => {
    await dbConnect();
    try {
      const workout = new Workout({
        coach: req.body.coach,
        assignedTo: req.body.assignedTo,
        name: req.body.name,
        additionalNotes: req.body.additionalNotes,
        days: req.body.days,
      });
      await workout.save();
      res.status(201).json(workout);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}
