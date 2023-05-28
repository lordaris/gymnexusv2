import  Workout  from "../../../../../models/Workout";
import dbConnect from "../../../../../utils/mongodb";
import authMiddleware from "../../../../../middleware/authMiddleware";


// GET one workout based on its id
export default function listWorkoutById(req, res) {
    return new Promise((resolve, reject) => {
      authMiddleware(req, res, async () => {
        const { id } = req.query;
  
        try {
          await dbConnect();
          const workout = await Workout.findById(id);
          res.status(200).json(workout);
          resolve();
        } catch (err) {
          res.status(400).json({ message: err.message });
          reject(err);
        }
      });
    });
  }
  