import { useState, useEffect } from "react";
import { workoutsAPI } from "../utils/apiClient";
import { toast } from "react-toastify";

export function useWorkouts(coachId, initialWorkouts = []) {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await workoutsAPI.getByCoach(coachId);
      setWorkouts(response.data);
    } catch (err) {
      setError("Failed to load workouts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coachId) {
      fetchWorkouts();
    }
  }, [coachId]);

  const addWorkout = async (workoutData) => {
    try {
      const response = await workoutsAPI.create(workoutData);
      setWorkouts([...workouts, response.data]);
      toast.success("Workout created successfully");
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      await workoutsAPI.delete(workoutId);
      setWorkouts(workouts.filter((workout) => workout._id !== workoutId));
      toast.success("Workout deleted successfully");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    workouts,
    loading,
    error,
    fetchWorkouts,
    addWorkout,
    deleteWorkout,
  };
}
