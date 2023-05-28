import { Workout } from "../../../models/Workout";
import dbConnect from "../../../utils/mongodb";
import authMiddleware from "../../../middleware/authMiddleware";

export default async function deleteElements(req, res) {
  await authMiddleware(req, res, async () => {
    const { params } = req.query;

    if (params.length === 1) {
      const [workoutId] = params;
      deleteWorkout(req, res, workoutId);
    } else if (params.length === 2) {
      const [workoutId, dayId] = params;
      deleteOneDay(req, res, workoutId, dayId);
    } else if (params.length === 3) {
      const [workoutId, dayId, exerciseId] = params;
      deleteOneExercise(req, res, workoutId, dayId, exerciseId);
    }
  });
}

async function deleteWorkout(req, res, workoutId) {
  await dbConnect();
  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    if (workout.coach != req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this workout!" });
    }

    await Workout.findByIdAndDelete(workoutId);

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteOneDay(req, res, workoutId, dayId) {
  await dbConnect();
  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    } else if (workout.coach != req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this workout!" });
    } else {
      const day = workout.days.id(dayId);
      if (!day) {
        return res.status(404).json({ error: "Day not found" });
      } else {
        // Delete day from workout
        workout.days.pull(dayId);
        await workout.save();

        res.status(200).json({ message: "Day deleted successfully" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteOneExercise(req, res, workoutId, dayId, exerciseId) {
  await dbConnect();
  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    } else if (workout.coach != req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this workout!" });
    } else {
      const day = workout.days.id(dayId);
      if (!day) {
        return res.status(404).json({ error: "Day not found" });
      } else {
        const exercise = day.exercises.id(exerciseId);
        if (!exercise) {
          return res.status(404).json({ error: "Exercise not found" });
        } else {
          // Delete exercise from day
          day.exercises.pull(exerciseId);
          await workout.save();

          res.status(200).json({ message: "Exercise deleted successfully" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
