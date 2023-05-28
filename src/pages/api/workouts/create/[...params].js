import  Workout  from "../../../../models/Workout";
import authMiddleware from "../../../../middleware/authMiddleware";
import dbConnect from "../../../../utils/mongodb";



export default async function createElement(req, res) {
    await authMiddleware(req, res, async () => {
      const { params } = req.query;
  
      if (params.length === 1) {
        const [workoutId] = params;
        addDay(req, res, workoutId);
      } else if (params.length === 2) {
        const [workoutId, dayId] = params;
        addExercise(req, res, workoutId, dayId);
      } 
    });
  }



async function addDay(req, res, workoutId) {
 
      await dbConnect();
  
      try {
        const workout = await Workout.findById(workoutId);
  
        if (!workout) {
          return res.status(404).json({ error: "Workout not found" });
        } else if (workout.coach != req.user._id) {
          return res
            .status(403)
            .json({ message: "You are not authorized to update this workout!" });
        } else {
          workout.days.push(req.body);
          await workout.save();
          res.status(201).json(workout.days[workout.days.length - 1]);
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  }


  async function addExercise(req, res, workoutId, dayId) {
        

    const { name, sets, reps, cadence, notes, video } = req.body;
    dbConnect()
    try {
      const workout = await Workout.findById(workoutId);
      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }
      const day = workout.days.id(dayId);
      if (!day) {
        return res.status(404).json({ error: "Day not found" });
      }
      day.exercises.push({ name, sets, reps, cadence, notes, video });
      await workout.save();
      res.status(201).json(day.exercises[day.exercises.length - 1]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
}