import { Workout } from "../../../models/Workout";
import dbConnect from "../../../utils/mongodb";
import authMiddleware from "../../../middleware/authMiddleware";
/*
 * Update a workout or an exercise depending on the number of params
 */

// TODO: Add the authMiddleware
export default async function update(req, res) {
  const { params } = req.query;
  await authMiddleware(req, res, async () => {
    if (params.length === 1) {
      const [workoutId] = params;
      await updateWorkout(req, res, workoutId);
    } else if (params.length === 3) {
      const [workoutId, dayId, exerciseId] = params;
      await updateExercise(req, res, workoutId, dayId, exerciseId);
    }
  });
}

async function updateWorkout(req, res, workoutId) {
  await dbConnect();

  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    if (workout.coach != req.user._id) {
      return res.status(403).json({
        message: "You are not authorized to update this workout!",
      });
    }
    await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateExercise(req, res, workoutId, dayId, exerciseId) {
  const { name, sets, reps, cadence, notes, video } = req.body;
  await dbConnect();

  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    const day = workout.days.id(dayId);
    if (!day) {
      return res.status(404).json({ error: "Day not found" });
    }
    const exercise = day.exercises.id(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    exercise.set({ name, sets, reps, cadence, notes, video });
    await workout.save();
    res.status(200).json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
